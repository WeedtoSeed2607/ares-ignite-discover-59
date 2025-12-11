import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { HelpCircle, Upload, X, FileText, Image as ImageIcon, Send } from "lucide-react";

const enquiryTypes = [
  { value: "bug", label: "Bug Report", description: "Something isn't working correctly" },
  { value: "feature", label: "Feature Request", description: "Suggest a new feature or improvement" },
  { value: "account", label: "Account Issue", description: "Problems with your account or login" },
  { value: "billing", label: "Payment/Billing", description: "Questions about payments or subscriptions" },
  { value: "feedback", label: "General Feedback", description: "Share your thoughts about ARES" },
  { value: "partnership", label: "Partnership Inquiry", description: "Business or collaboration opportunities" },
  { value: "other", label: "Other", description: "Something else not listed above" },
];

const HelpContact = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [enquiryType, setEnquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  const handleFileSelect = (file: File) => {
    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (JPG, PNG, GIF) or document (PDF, DOC, DOCX)",
        variant: "destructive",
      });
      return;
    }
    
    setAttachedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enquiryType) {
      toast({
        title: "Please select an enquiry type",
        variant: "destructive",
      });
      return;
    }
    
    if (message.length < 10) {
      toast({
        title: "Message too short",
        description: "Please provide more details (at least 10 characters)",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission (in production, this would send to backend)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Feedback submitted!",
      description: "Thank you for your feedback. We'll get back to you soon.",
    });
    
    // Reset form
    setEnquiryType("");
    setMessage("");
    setAttachedFile(null);
    setIsSubmitting(false);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Help & Contact</h1>
            <p className="text-muted-foreground text-sm">Get in touch with the ARES team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enquiry Type Selection */}
          <div className="glass-card p-6 space-y-4">
            <Label className="text-base font-semibold">What can we help you with?</Label>
            <RadioGroup value={enquiryType} onValueChange={setEnquiryType} className="grid gap-3">
              {enquiryTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    enquiryType === type.value 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value={type.value} className="mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Message Box */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="message" className="text-base font-semibold">Tell us more</Label>
              <span className="text-xs text-muted-foreground">{message.length}/2000</span>
            </div>
            <Textarea
              id="message"
              placeholder="Please describe your issue, feedback, or question in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* File Attachment */}
          <div className="glass-card p-6 space-y-4">
            <Label className="text-base font-semibold">Attachment (optional)</Label>
            
            {!attachedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">Drop a file here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF, PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                {getFileIcon(attachedFile)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(attachedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Contact Info (pre-filled) */}
          <div className="glass-card p-6 space-y-4">
            <Label className="text-base font-semibold">Your contact info</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-1 bg-muted/50"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              We'll respond to your registered email address
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={isSubmitting || !enquiryType || message.length < 10}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HelpContact;
