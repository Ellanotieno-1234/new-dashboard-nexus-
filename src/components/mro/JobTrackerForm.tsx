"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Clock as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

interface JobTrackerData {
  customer: string;
  description: string;
  part_number: string;
  serial_number: string;
  lpo_date: Date;
  lpo_number: string;
  ro_number: string;
  kq_repair_order_date: Date;
  job_card_no: string;
  job_card_date: Date;
  kq_works_order_wo_no: string;
  kq_works_order_date: Date;
  job_status: string;
  job_status_date: Date;
  job_card_shared_with_finance: string;
}
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JOB_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
  "On Hold",
  "Cancelled"
];

export function JobTrackerForm({ initialData, onSave }: {
  initialData?: Partial<JobTrackerData>;
  onSave: (data: JobTrackerData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<JobTrackerData>({
    customer: initialData?.customer || "",
    description: initialData?.description || "",
    part_number: initialData?.part_number || "",
    serial_number: initialData?.serial_number || "",
    lpo_date: initialData?.lpo_date || new Date(),
    lpo_number: initialData?.lpo_number || "",
    ro_number: initialData?.ro_number || "",
    kq_repair_order_date: initialData?.kq_repair_order_date || new Date(),
    job_card_no: initialData?.job_card_no || "",
    job_card_date: initialData?.job_card_date || new Date(),
    kq_works_order_wo_no: initialData?.kq_works_order_wo_no || "",
    kq_works_order_date: initialData?.kq_works_order_date || new Date(),
    job_status: initialData?.job_status || "Pending",
    job_status_date: initialData?.job_status_date || new Date(),
    job_card_shared_with_finance: initialData?.job_card_shared_with_finance || "No"
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof JobTrackerData, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer */}
        <div>
          <Label>Customer</Label>
          <Input
            value={formData.customer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("customer", e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("description", e.target.value)}
            required
          />
        </div>

        {/* Part Number */}
        <div>
          <Label>Part Number</Label>
          <Input
            value={formData.part_number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("part_number", e.target.value)}
          />
        </div>

        {/* Serial Number */}
        <div>
          <Label>Serial Number</Label>
          <Input
            value={formData.serial_number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("serial_number", e.target.value)}
          />
        </div>

        {/* LPO Date */}
        <div>
          <Label>LPO Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.lpo_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.lpo_date ? format(formData.lpo_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.lpo_date}
                onSelect={(date?: Date) => date && handleChange("lpo_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* LPO Number */}
        <div>
          <Label>LPO Number</Label>
          <Input
            value={formData.lpo_number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("lpo_number", e.target.value)}
          />
        </div>

        {/* RO Number */}
        <div>
          <Label>RO Number</Label>
          <Input
            value={formData.ro_number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("ro_number", e.target.value)}
          />
        </div>

        {/* KQ Repair Order Date */}
        <div>
          <Label>KQ Repair Order Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.kq_repair_order_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.kq_repair_order_date ? format(formData.kq_repair_order_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.kq_repair_order_date}
                onSelect={(date?: Date) => date && handleChange("kq_repair_order_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Job Card Number */}
        <div>
          <Label>Job Card Number</Label>
          <Input
            value={formData.job_card_no}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("job_card_no", e.target.value)}
          />
        </div>

        {/* Job Card Date */}
        <div>
          <Label>Job Card Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.job_card_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.job_card_date ? format(formData.job_card_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.job_card_date}
                onSelect={(date?: Date) => date && handleChange("job_card_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* KQ Works Order WO No */}
        <div>
          <Label>KQ Works Order WO No</Label>
          <Input
            value={formData.kq_works_order_wo_no}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("kq_works_order_wo_no", e.target.value)}
          />
        </div>

        {/* KQ Works Order Date */}
        <div>
          <Label>KQ Works Order Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.kq_works_order_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.kq_works_order_date ? format(formData.kq_works_order_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.kq_works_order_date}
                onSelect={(date?: Date) => date && handleChange("kq_works_order_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Job Status */}
        <div>
          <Label>Job Status</Label>
          <Select
            value={formData.job_status}
            onValueChange={(value: string) => handleChange("job_status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {JOB_STATUSES.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Status Date */}
        <div>
          <Label>Job Status Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.job_status_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.job_status_date ? format(formData.job_status_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.job_status_date}
                onSelect={(date?: Date) => date && handleChange("job_status_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Shared with Finance */}
        <div>
          <Label>Shared with Finance</Label>
          <Select
            value={formData.job_card_shared_with_finance}
            onValueChange={(value: string) => handleChange("job_card_shared_with_finance", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
