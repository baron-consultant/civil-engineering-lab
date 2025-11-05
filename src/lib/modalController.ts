// modalController.ts

let isInitialized = false;
let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

export function initModalController() {
  if (isInitialized) {
    return; // 이미 초기화되었으면 재초기화하지 않음
  }

  isInitialized = true;

  // 버튼 클릭 이벤트 위임
  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest("[data-modal]");
    if (target) {
      const modalId = target.getAttribute("data-modal");
      if (modalId) openModal(modalId);
    }

    // 모달 닫기 버튼 클릭
    const closeBtn = (e.target as HTMLElement).closest(".modal .close");
    if (closeBtn) {
      const modal = closeBtn.closest(".modal") as HTMLElement;
      if (modal) closeModal(modal);
    }

    // 모달 외부 클릭
    const modalEl = (e.target as HTMLElement).closest(".modal");
    if (modalEl && e.target === modalEl) {
      closeModal(modalEl);
    }
  });

  // ESC 키 이벤트
  escapeHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      const activeModals = document.querySelectorAll<HTMLElement>(".modal");
      activeModals.forEach((modal) => {
        if (modal.style.display === "block") closeModal(modal);
      });
    }
  };

  document.addEventListener("keydown", escapeHandler);
}

function openModal(modalId: string) {
  const modal = document.getElementById(modalId) as HTMLElement;
  if (!modal) return;

  const video = modal.querySelector("video") as HTMLVideoElement;
  modal.style.display = "block";

  if (video) {
    video.currentTime = 0;
    video.play();
  }
}

function closeModal(modal: HTMLElement) {
  const video = modal.querySelector("video") as HTMLVideoElement;
  modal.style.display = "none";

  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}
