"use client";
// ==============================================================================
// features/careers/presentation/components/public-application-form.tsx
// Public Job Application Submission Form (RHF + Zod + Supabase CV Storage Upload)
// ==============================================================================
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Upload, CheckCircle2, FileText, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  Textarea,
} from "@shared/ui";
import {
  useUploadCv,
  useSubmitCareerApplication,
} from "@shared/hooks/careers/use-career-hooks";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Valid phone number is required"),
  coverMessage: z.string().optional().nullable(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface PublicApplicationFormProps {
  jobId?: string | null;
  jobTitle?: string | null;
}

export function PublicApplicationForm({ jobId, jobTitle }: PublicApplicationFormProps) {
  const t = useTranslations("careersPublic");

  const uploadCvMutation = useUploadCv();
  const submitAppMutation = useSubmitCareerApplication();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      coverMessage: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError("Invalid file format. Please upload a PDF, DOC, or DOCX document.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10MB limit.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const isSubmitting = uploadCvMutation.isPending || submitAppMutation.isPending;

  const onSubmit = async (values: ApplicationFormValues) => {
    if (!selectedFile) {
      setFileError("Please select and upload your CV / Resume document.");
      return;
    }

    try {
      // 1. Upload CV to Supabase career-cvs storage bucket
      const uploaded = await uploadCvMutation.mutateAsync(selectedFile);

      // 2. Submit application record to database
      await submitAppMutation.mutateAsync({
        jobId: jobId ?? null,
        jobTitle: jobTitle ?? null,
        applicantName: values.fullName,
        email: values.email,
        phone: values.phone,
        coverMessage: values.coverMessage ?? null,
        cvFileUrl: uploaded.url,
        cvFileName: uploaded.fileName,
        status: "new",
      });

      setIsSuccess(true);
      reset();
      setSelectedFile(null);
    } catch (err: any) {
      setFileError(err.message || "Failed to submit application.");
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">{t("successMessage")}</h3>
            <p className="text-sm text-muted-foreground">
              We have received your resume for {jobTitle || "our career opening"}.
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsSuccess(false)}>
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Send className="h-5 w-5 text-primary" />
          {t("applyHeader")}
        </CardTitle>
        <CardDescription>
          Submit your contact details and attach your CV resume to apply for this opening.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">{t("fullName")}</Label>
            <Input id="fullName" {...register("fullName")} placeholder="e.g. John Doe" />
            {errors.fullName && <span className="text-xs text-destructive">{errors.fullName.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" {...register("email")} placeholder="name@example.com" />
              {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" {...register("phone")} placeholder="+966 50 000 0000" />
              {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coverMessage">{t("coverMessage")}</Label>
            <Textarea
              id="coverMessage"
              rows={4}
              {...register("coverMessage")}
              placeholder="Briefly introduce yourself, your key experience, and why you are a great fit..."
            />
          </div>

          {/* CV Upload File Input */}
          <div className="space-y-1.5 pt-2 border-t">
            <Label htmlFor="cvFile">{t("uploadCv")}</Label>
            <div className="flex items-center gap-3">
              <Input
                id="cvFile"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            {selectedFile && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium pt-1">
                <FileText className="h-3.5 w-3.5" />
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
            {fileError && <span className="text-xs text-destructive">{fileError}</span>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full gap-2 mt-4">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {t("submitApp")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
