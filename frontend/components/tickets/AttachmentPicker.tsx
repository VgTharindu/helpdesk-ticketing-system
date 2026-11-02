'use client';

import { useRef, type ChangeEvent } from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui";
import { formatFileSize } from "@/lib/utils";
import { ATTACHMENT_ACCEPT, MAX_ATTACHMENTS } from "@/services/tickets";

interface AttachmentPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export function AttachmentPicker({ files, onChange, error }: AttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    onChange([...files, ...selected]);
    // Reset so the same file can be selected again after removing it
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ATTACHMENT_ACCEPT}
        className="hidden"
        onChange={handleSelect}
      />

      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        disabled={files.length >= MAX_ATTACHMENTS}
      >
        <Paperclip size={14} className="mr-1" />
        Attach files
      </Button>

      <p className="mt-1 text-xs text-text-muted">Up to 3 files · JPG, PNG or PDF · max 3 MB each</p>

      {files.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-control border border-border px-3 py-2 text-sm"
            >
              <span className="truncate text-text">{file.name}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-text-muted">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="text-text-muted hover:text-danger"
                >
                  <X size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}