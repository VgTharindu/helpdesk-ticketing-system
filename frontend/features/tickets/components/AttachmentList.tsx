import { Download, FileImage, FileText } from "lucide-react";
import { formatFileSize } from "@/utils/format-file-size";
import { attachmentDownloadUrl } from "../api";
import type { TicketAttachment } from "@/lib/api/types";

export function AttachmentList({ attachments }: { attachments: TicketAttachment[] }) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <p className="text-sm font-medium text-text">Attachments ({attachments.length})</p>

      <ul className="flex flex-col gap-1">
        {attachments.map((attachment) => {
          const Icon = attachment.mime_type === "application/pdf" ? FileText : FileImage;

          return (
            <li key={attachment.id}>
              {/* Plain link: the browser sends the auth cookie to the proxy and downloads the file */}
              <a
                href={attachmentDownloadUrl(attachment.download_path)}
                className="flex items-center gap-2 rounded-control border border-border px-3 py-2 text-sm hover:bg-background"
              >
                <Icon size={16} className="shrink-0 text-text-muted" />
                <span className="flex-1 truncate text-text">{attachment.name}</span>
                <span className="text-xs text-text-muted">{formatFileSize(attachment.size)}</span>
                <Download size={14} className="shrink-0 text-text-muted" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}