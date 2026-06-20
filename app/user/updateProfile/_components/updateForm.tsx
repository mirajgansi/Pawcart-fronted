"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleDeleteMe, handleUpdateProfile } from "@/lib/actions/auth-actions";
import { Camera, PawPrint, User } from "lucide-react";
import DeleteAccountModal from "@/app/_componets/DeleteAccountModal";
import { useAuth } from "@/context/AuthContext";
import { FormSelect } from "@/app/_componets/dropdown";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
  email: z.string().email("Email is invalid"),
  username: z.string().min(3, { message: "Minimum 3 characters" }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
  phoneNumber: z.string().max(10, "Max 10 digits").optional(),
  location: z.string().optional(),
  DOB: z.string().optional(),
  gender: z.string().optional(),
});

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// UI-only for now — not in the schema, not sent to the server.
const petTypeOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "other", label: "Other" },
];

export type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function UpdateUserForm({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      DOB: user?.DOB || "",
      gender: user?.gender || "",
    },
    mode: "onSubmit",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI-only placeholders for pet info — wire up once the schema/API support it.
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");

  useEffect(() => {
    reset({
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      DOB: user?.DOB || "",
      gender: user?.gender || "",
    });
  }, [user, reset]);

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const clearImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UpdateUserData) => {
    try {
      const formData = new FormData();

      formData.append("email", data.email);
      formData.append("username", data.username);

      if (data.phoneNumber?.trim()) formData.append("phoneNumber", data.phoneNumber.trim());
      if (data.location?.trim()) formData.append("location", data.location.trim());
      if (data.DOB) formData.append("DOB", data.DOB);
      if (data.gender?.trim()) formData.append("gender", data.gender.trim());
      if (data.image) formData.append("image", data.image);

      const response = await handleUpdateProfile(formData);

      if (!response?.success) {
        toast.error(response?.message || "Update profile failed");
        return;
      }

      toast.success("Profile updated successfully");
      clearImage();

      reset(
        {
          email: data.email,
          username: data.username,
          phoneNumber: data.phoneNumber || "",
          location: data.location || "",
          DOB: data.DOB || "",
          gender: data.gender || "",
        },
        { keepDirty: false }
      );
    } catch (err: any) {
      toast.error(err?.message || "Profile update failed");
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setPetName("");
    setPetType("");
    reset(undefined, { keepDirty: false });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { logout } = useAuth();

  const onDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }

    setDeleting(true);

    const res = await handleDeleteMe(deletePassword);
    if (!res.success) {
      setDeleting(false);
      toast.error(res.message);
      return;
    }

    await logout();

    setDeleting(false);
    toast.success("Account deleted");

    window.location.href = "/login";
  };

  const inputBase =
    "h-12 w-full rounded-xl border-0 bg-[#F4F2F1] px-4 text-sm text-[#2A2120] placeholder:text-[#9C9290] outline-none transition focus:ring-2 focus:ring-[#7A1F1F]/30 disabled:opacity-70 disabled:cursor-not-allowed";

  const labelBase = "text-sm font-medium text-[#3A302E]";

  return (
    <div className="min-h-screen bg-[#F5F4F2] px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-[28px] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.06)] border border-black/5 p-8 md:p-10">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1F1717]">Update Profile</h2>
            <p className="mt-1.5 text-sm text-[#8A7E7C]">
              Keep your details and pet&apos;s information up to date.
            </p>
          </div>

          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange } }) => (
                  <div className="relative h-28 w-28">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#F0EDEC] bg-[#EDEAE8] shadow-sm">
                      {previewImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewImage}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : user?.image ? (
                        <Image
                          src={process.env.NEXT_PUBLIC_API_BASE_URL + user.image}
                          alt="Profile"
                          width={112}
                          height={112}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[#B3A8A6]">
                          <User size={40} />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Change profile picture"
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#7A1F1F] text-white shadow-md hover:bg-[#671A1A] transition"
                    >
                      <Camera size={15} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                      className="hidden"
                    />
                  </div>
                )}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 text-xs text-[#8A7E7C] hover:text-[#7A1F1F] transition"
              >
                Tap to change profile picture
              </button>
              {errors.image && (
                <p className="mt-1 text-xs text-red-600">{errors.image.message}</p>
              )}
            </div>

            {/* Personal info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className={labelBase}>Full Name</label>
                <input
                  {...register("username")}
                  className={inputBase}
                  placeholder="Username"
                />
                {errors.username?.message && (
                  <p className="text-xs text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelBase}>Email Address</label>
                <input
                  {...register("email")}
                  className={inputBase}
                  placeholder="you@example.com"
                />
                {errors.email?.message && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className={labelBase}>Phone Number</label>
                <input
                  {...register("phoneNumber")}
                  className={inputBase}
                  placeholder="98XXXXXXXX"
                />
                {errors.phoneNumber?.message && (
                  <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelBase}>Shipping Address</label>
                <input
                  {...register("location")}
                  className={inputBase}
                  placeholder="Enter your address"
                />
                {errors.location?.message && (
                  <p className="text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelBase}>Date of Birth</label>
                <input type="date" {...register("DOB")} className={inputBase} />
                {errors.DOB?.message && (
                  <p className="text-xs text-red-600">{errors.DOB.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className={labelBase}>Gender</label>
                <FormSelect<UpdateUserData>
                  control={control}
                  name="gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  error={errors.gender?.message}
                  className={inputBase}
                />
              </div>
            </div>

            {/* Pet info — UI only, not yet wired to schema/API */}
            <div className="mt-8 pt-6 border-t border-black/5">
              <div className="flex items-center gap-2">
                <PawPrint size={18} className="text-[#7A1F1F]" />
                <h3 className="text-base font-bold text-[#1F1717]">Pet Information</h3>
              </div>

              <div className="mt-4 rounded-2xl bg-[#FAF9F8] border border-black/5 p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className={labelBase}>Pet&apos;s Name</label>
                  <input
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#2A2120] placeholder:text-[#9C9290] outline-none transition focus:ring-2 focus:ring-[#7A1F1F]/30"
                    placeholder="Cooper"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelBase}>Pet Type</label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#2A2120] outline-none transition focus:ring-2 focus:ring-[#7A1F1F]/30"
                  >
                    <option value="" disabled>
                      Select pet type
                    </option>
                    {petTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || (!isDirty && !previewImage)}
                className="h-12 min-w-[180px] rounded-full bg-[#7A1F1F] px-8 text-sm font-semibold text-white hover:bg-[#671A1A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="h-12 rounded-full border border-black/10 px-8 text-sm font-semibold text-[#3A302E] hover:bg-black/5 transition"
              >
                Cancel
              </button>
            </div>

            {/* Delete account — de-emphasized */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="text-xs text-[#B3A8A6] hover:text-red-600 underline-offset-2 hover:underline transition"
              >
                Delete account
              </button>
            </div>

            <DeleteAccountModal
              open={deleteOpen}
              password={deletePassword}
              setPassword={setDeletePassword}
              deleting={deleting}
              onClose={() => {
                setDeleteOpen(false);
                setDeletePassword("");
              }}
              onConfirm={onDeleteAccount}
            />
          </form>
        </div>
      </div>
    </div>
  );
}