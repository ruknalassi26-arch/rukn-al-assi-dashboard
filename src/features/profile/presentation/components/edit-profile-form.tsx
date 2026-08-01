"use client";
// ==============================================================================
// features/profile/presentation/components/edit-profile-form.tsx
// React Hook Form + Zod for Editing Profile Details (Name & Phone)
// ==============================================================================
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Save, Loader2, Mail } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@shared/ui";
import { useUpdateProfileMutation } from "@shared/hooks/profile/use-profile-hooks";
import type { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";

const editProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  phone: z.string().optional().nullable(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  user: UserProfileEntity;
  onSuccess?: () => void;
}

export function EditProfileForm({ user, onSuccess }: EditProfileFormProps) {
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      phone: user.phone || "",
    },
  });

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName: values.fullName,
        phone: values.phone || null,
        avatarUrl: user.avatarUrl,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Edit Profile Information
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Update your personal contact details and display name.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-medium flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+964 750 000 0000"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Email Field (Read Only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email Address (Read Only)
            </Label>
            <Input value={user.email} disabled className="bg-muted cursor-not-allowed text-xs" />
            <p className="text-[11px] text-muted-foreground">
              Email address is managed by your system administrator and cannot be changed directly.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="gap-2"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Profile Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
