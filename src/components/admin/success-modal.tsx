"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "Berhasil!",
  message,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center flex flex-col items-center justify-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-center ">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
