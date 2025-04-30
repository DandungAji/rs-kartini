
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/admin/AdminLayout";
import { doctors, schedules as initialSchedules } from "@/lib/mockData";
import { Schedule, Doctor } from "@/lib/types";
import { Calendar, Clock, Edit, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  
  const filteredSchedules = schedules.filter((schedule) => {
    const doctor = doctors.find((d) => d.id === schedule.doctorId);
    const doctorMatch = !selectedDoctor || schedule.doctorId === selectedDoctor;
    const dayMatch = !selectedDay || schedule.day === selectedDay;
    const searchMatch =
      !searchTerm ||
      (doctor &&
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return doctorMatch && dayMatch && searchMatch;
  });
  
  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule({ ...schedule });
    setIsDialogOpen(true);
  };
  
  const handleSave = () => {
    if (editingSchedule) {
      setSchedules(
        schedules.map((schedule) =>
          schedule.id === editingSchedule.id ? editingSchedule : schedule
        )
      );
      setIsDialogOpen(false);
      setEditingSchedule(null);
    }
  };
  
  const handleStatusChange = (id: string, newStatus: "active" | "inactive") => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, status: newStatus } : schedule
      )
    );
  };
  
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Doctor Schedules</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search doctor..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="w-[180px]">
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="All doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-[180px]">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="All days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All days</SelectItem>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Doctor</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => {
                const doctor = doctors.find((d) => d.id === schedule.doctorId);
                return (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      {doctor ? doctor.name : "Unknown Doctor"}
                    </TableCell>
                    <TableCell>{schedule.day}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{schedule.location}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={schedule.status === "active" ? "default" : "outline"}
                        className={
                          schedule.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {schedule.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No schedules found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the schedule details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">
                Doctor
              </Label>
              <div className="col-span-3">
                <Select
                  value={editingSchedule?.doctorId || ""}
                  onValueChange={(value) =>
                    setEditingSchedule(prev => prev ? { ...prev, doctorId: value } : null)
                  }
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day" className="text-right">
                Day
              </Label>
              <div className="col-span-3">
                <Select
                  value={editingSchedule?.day || ""}
                  onValueChange={(value: any) =>
                    setEditingSchedule(prev => prev ? { ...prev, day: value } : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <div className="col-span-3">
                <Input
                  id="startTime"
                  type="time"
                  value={editingSchedule?.startTime || ""}
                  onChange={(e) =>
                    setEditingSchedule(prev => prev ? { ...prev, startTime: e.target.value } : null)
                  }
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <div className="col-span-3">
                <Input
                  id="endTime"
                  type="time"
                  value={editingSchedule?.endTime || ""}
                  onChange={(e) =>
                    setEditingSchedule(prev => prev ? { ...prev, endTime: e.target.value } : null)
                  }
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <div className="col-span-3">
                <Input
                  id="location"
                  placeholder="Room number"
                  value={editingSchedule?.location || ""}
                  onChange={(e) =>
                    setEditingSchedule(prev => prev ? { ...prev, location: e.target.value } : null)
                  }
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={editingSchedule?.status === "active"}
                  onCheckedChange={(checked) =>
                    setEditingSchedule(prev => 
                      prev ? { ...prev, status: checked ? "active" : "inactive" } : null
                    )
                  }
                />
                <span>
                  {editingSchedule?.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
