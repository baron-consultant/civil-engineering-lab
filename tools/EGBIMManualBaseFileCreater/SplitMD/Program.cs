using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace SplitMD
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var mdFile = @"E:\Test\Command\_.md";
            Extract(File.ReadAllLines(mdFile));
        }

        static void Extract(string[] mdLines)
        {
            var startPoints = new List<int>();
            for(int i = 0; i < mdLines.Length; i++)
            {
                if (mdLines[i].Contains("(명령어)"))
                    startPoints.Add(i);
            }

            var indexInfo = new List<(int start, int end)>();
            for(int i = 0; i < startPoints.Count; i++)
            {
                int start = startPoints[i];
                int end;
                if (i == startPoints.Count - 1)
                    end = mdLines.Length;
                else
                    end = startPoints[i + 1] - 2;

                indexInfo.Add((start, end));
            }

            foreach(var index in indexInfo)
            {
                SaveContents(mdLines, index);
            }
        }

        static void SaveContents(string[] mdLines, (int start, int end) index)
        {
            var command = mdLines[index.start].Replace("(명령어)","").Replace("# **", "").Replace("**","").Trim();

            var header = new StringBuilder();
            header.AppendLine("---");
            header.AppendLine($"title: {command}");
            header.AppendLine("---");
            header.AppendLine();
            header.AppendLine("import { Icon } from '@astrojs/starlight/components';");
            header.AppendLine("import { Image } from 'astro:assets';");
            header.AppendLine();

            var body = new StringBuilder();
            string pattern = @"!\[\]\[image\d+\]";

            int curIdx = 1;
            for (int i = index.start + 1; i < index.end; i++)
            {
                var addLine = mdLines[i];
                MatchCollection matches = Regex.Matches(addLine, pattern);
                foreach (Match match in matches)
                    addLine = addLine.Replace(match.Value, $"![][image{curIdx++}]");
                body.AppendLine(addLine);
            }

            for (int i = 1; i < curIdx; i++)
            {
                header.AppendLine($"[image{i}]: ../../../../../assets/images/commands/{command.ToLower()}/image{i}.png");
            }

            header.Append(body.ToString());

            header.AppendLine("[**<Icon name=\"youtube\" class=\"emoji\"/> 시연 영상 보기**]()");

            var dir = $@"E:\Test\Command\_mdx\{command.First().ToString().ToUpper()}";
            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            File.Delete($@"{dir}\_{command}.mdx");
            File.WriteAllText($@"{dir}\_{command.ToLower()}.mdx", header.ToString());
        }
    }
}
