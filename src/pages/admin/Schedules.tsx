
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { doctors, schedules as initialSchedules, departments } from "@/lib/mockData";
import { Doctor, Schedule } from "@/lib/types";
import { Calendar, Clock, Edit, Plus, Search, Trash, User } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Schedules() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules.map(s => ({ ...s, status: 'active' }))); // Add status to existing schedules
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    doctorId: "",
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    location: "",
    status: "active"
  });
  
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  
  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  
  // Filter doctors based on department
  const filteredDoctors = selectedDepartment === "all" 
    ? doctors 
    : doctors.filter(doctor => doctor.specialization === selectedDepartment);
  
  // Filter schedules based on search query and selected doctor
  const filteredSchedules = schedules.filter(schedule => {
    const doctor = doctors.find(d => d.id === schedule.doctorId);
    if (!doctor) return false;
    
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || doctor.specialization === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Group schedules by day
  const schedulesByDay: Record<string, Schedule[]> = {};
  weekDays.forEach(day => {
    schedulesByDay[day] = filteredSchedules.filter(schedule => schedule.day === day);
  });
  
  const handleAddSchedule = () => {
    if (!newSchedule.doctorId) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = `${schedules.length + 1}`;
    
    const scheduleToAdd: Schedule = {
      id: newId,
      doctorId: newSchedule.doctorId,
      day: newSchedule.day as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
      startTime: newSchedule.startTime || "09:00",
      endTime: newSchedule.endTime || "17:00",
      location: newSchedule.location || "",
      status: newSchedule.status as "active" | "inactive" || "active",
    };
    
    setSchedules([...schedules, scheduleToAdd]);
    
    toast({
      title: "Schedule Added",
      description: "The new schedule has been added successfully.",
    });
    
    // Reset form
    setNewSchedule({
      doctorId: "",
      day: "Monday",
      startTime: "09:00",
      endTime: "17:00",
      location: "",
      status: "active"
    });
  };
  
  const handleUpdateSchedule = () => {
    if (!editingSchedule) return;
    
    setSchedules(schedules.map(schedule => 
      schedule.id === editingSchedule.id ? editingSchedule : schedule
    ));
    
    toast({
      title: "Schedule Updated",
      description: "The schedule has been updated successfully.",
    });
    
    setEditingSchedule(null);
  };
  
  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    
    toast({
      title: "Schedule Deleted",
      description: "The schedule has been removed.",
    });
  };
  
  const toggleScheduleStatus = (id: string) => {
    setSchedules(schedules.map(schedule => {
      if (schedule.id === id) {
        const newStatus = schedule.status === "active" ? "inactive" : "active";
        return { ...schedule, status: newStatus };
      }
      return schedule;
    }));
    
    toast({
      title: "Status Updated",
      description: "The schedule status has been toggled.",
    });
  };
  
  const getDoctorById = (id: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === id);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Doctor Schedules</h1>
        <div className="flex gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Add New Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <Select
                value={newSchedule.doctorId}
                onValueChange={(value) => setNewSchedule({...newSchedule, doctorId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                Day
              </label>
              <select
                className="w-full p-2 border rounded"
                value={newSchedule.day}
                onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"})}
                required
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <Input
                id="startTime"
                type="time"
                value={newSchedule.startTime}
                onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <Input
                id="endTime"
                type="time"
                value={newSchedule.endTime}
                onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                id="location"
                placeholder="e.g., Main Building, 3rd Floor"
                value={newSchedule.location}
                onChange={(e) => setNewSchedule({...newSchedule, location: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 mb-4">
            <Switch 
              id="schedule-status"
              checked={newSchedule.status === "active"}
              onCheckedChange={(checked) => 
                setNewSchedule({...newSchedule, status: checked ? "active" : "inactive"})
              }
            />
            <Label htmlFor="schedule-status">
              Active Schedule
            </Label>
          </div>
          
          <Button onClick={handleAddSchedule} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="Monday">
        <TabsList className="mb-6 overflow-x-auto flex justify-start w-full">
          {weekDays.map(day => (
            <TabsTrigger key={day} value={day} className="flex-1 md:flex-none">
              {day}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekDays.map(day => (
          <TabsContent key={day} value={day}>
            <h2 className="text-lg font-medium mb-4">Schedules for {day}</h2>
            
            {schedulesByDay[day].length > 0 ? (
              <div className="space-y-4">
                {schedulesByDay[day].map(schedule => {
                  const doctor = getDoctorById(schedule.doctorId);
                  
                  return (
                    <Card key={schedule.id} className={`hover:shadow-sm transition-shadow ${schedule.status === 'inactive' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                            <User size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{doctor?.name || "Unknown Doctor"}</p>
                            <p className="text-sm text-gray-500">{doctor?.specialization}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-gray-600">
                            <Clock size={16} className="mr-1" />
                            <span className="text-sm">
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                          
                          {schedule.location && (
                            <div className="hidden md:block text-sm text-gray-500 max-w-[200px] truncate">
                              {schedule.location}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id={`status-${schedule.id}`}
                              checked={schedule.status === "active"}
                              onCheckedChange={() => toggleScheduleStatus(schedule.id)}
                              className="data-[state=checked]:bg-primary"
                            />
                            <span className="text-xs font-medium">
                              {schedule.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Edit size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Schedule</DialogTitle>
                              </DialogHeader>
                              {setEditingSchedule(schedule)}
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="edit-time-start" className="text-right text-sm">
                                    Start Time
                                  </label>
                                  <Input
                                    id="edit-time-start"
                                    type="time"
                                    className="col-span-3"
                                    value={editingSchedule?.startTime || schedule.startTime}
                                    onChange={(e) => setEditingSchedule(prev => 
                                      prev ? { ...prev, startTime: e.target.value } : null
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="edit-time-end" className="text-right text-sm">
                                    End Time
                                  </label>
                                  <Input
                                    id="edit-time-end"
                                    type="time"
                                    className="col-span-3"
                                    value={editingSchedule?.endTime || schedule.endTime}
                                    onChange={(e) => setEditingSchedule(prev => 
                                      prev ? { ...prev, endTime: e.target.value } : null
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="edit-location" className="text-right text-sm">
                                    Location
                                  </label>
                                  <Input
                                    id="edit-location"
                                    className="col-span-3"
                                    value={editingSchedule?.location || schedule.location || ""}
                                    onChange={(e) => setEditingSchedule(prev => 
                                      prev ? { ...prev, location: e.target.value } : null
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="text-right text-sm">
                                    Status
                                  </div>
                                  <div className="col-span-3 flex items-center space-x-2">
                                    <Switch 
                                      id={`edit-status-${schedule.id}`}
                                      checked={editingSchedule?.status === "active"}
                                      onCheckedChange={(checked) => setEditingSchedule(prev => 
                                        prev ? { ...prev, status: checked ? "active" : "inactive" } : null
                                      )}
                                    />
                                    <Label htmlFor={`edit-status-${schedule.id}`}>
                                      {editingSchedule?.status === "active" ? "Active" : "Inactive"}
                                    </Label>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleUpdateSchedule}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteSchedule(schedule.id)} 
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Schedules Found</h3>
                <p className="text-gray-500 mb-4">
                  There are no schedules for this day matching your filters.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </AdminLayout>
  );
}
