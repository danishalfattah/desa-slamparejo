"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save } from "lucide-react";
import { SuccessModal } from "@/components/admin/success-modal";

// Impor fungsi autentikasi Firebase dan tipe error
import { auth } from "@/lib/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function PengaturanPage() {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Password baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal harus 6 karakter.");
      return;
    }

    setIsSaving(true);

    const user = auth.currentUser;

    if (!user || !user.email) {
      setError(
        "Tidak dapat menemukan user yang sedang login. Silakan coba login kembali."
      );
      setIsSaving(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change Password Error:", err);
      let errorMessage = "Gagal mengubah password.";

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/wrong-password":
            errorMessage = "Password lama yang Anda masukkan salah.";
            break;
          case "auth/weak-password":
            errorMessage = "Password baru terlalu lemah. Minimal 6 karakter.";
            break;
          case "auth/requires-recent-login":
            errorMessage =
              "Sesi Anda telah berakhir. Silakan logout dan login kembali untuk mengubah password.";
            break;
        }
      }
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        message="Password Anda berhasil diubah!"
      />
      <PageHeader
        title="Pengaturan Akun"
        description="Ubah password akun admin Anda."
      />
      <DataCard
        title="Ubah Password"
        description="Masukkan password lama dan password baru Anda."
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email || "Tidak dapat memuat email"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Password Lama</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DataCard>
    </div>
  );
}
