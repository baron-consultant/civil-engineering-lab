namespace CommandVideoCopy
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var sourceDir = @"V:\";
            var targetDir = @"E:\Test\UploadPool";
            var commnadpath = "D:\\eg-bim_guide\\src\\content\\docs\\ko\\commands";
            var needVideos = Directory.GetFiles(commnadpath, "*.mdx", SearchOption.AllDirectories)
                .Select(i => Path.GetFileName(i))
                .Where(i => i.StartsWith("_"))
                .Select(i => Path.GetFileNameWithoutExtension(i.TrimStart('_')));

            if(Directory.Exists(targetDir))
                Directory.Delete(targetDir, true);

            Directory.CreateDirectory(targetDir);

            foreach (var i in needVideos)
            {
                var videoDir = $"{sourceDir}{i}";
                //Console.WriteLine(videoDir);
                if (Directory.Exists(videoDir))
                {
                    foreach(var file in Directory.GetFiles(videoDir, "*.*", SearchOption.AllDirectories))
                    {
                        File.Copy(file, Path.Combine(targetDir, Path.GetFileName(file)), true);
                    }
                }
                else
                {
                    Console.WriteLine(i);
                }
            }

        }
    }
}
