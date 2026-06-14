import "./db.js";
import Admin from "./models/Admin.js";
import Student from "./models/Student.js";
import Room from "./models/Room.js";
import Complaint from "./models/Complaint.js";
import LeaveRequest from "./models/LeaveRequest.js";
import Fee from "./models/Fee.js";

const seed = async () => {
  try {
    await Admin.deleteMany({});
    await Student.deleteMany({});
    await Room.deleteMany({});
    await Complaint.deleteMany({});
    await LeaveRequest.deleteMany({});
    await Fee.deleteMany({});

    await Admin.create({ name: "Admin", email: "admin@hostel.com", password: "admin123" });
    console.log("Admin created: admin@hostel.com / admin123");

    await Room.create([
      { roomNumber: "101", floor: 1, capacity: 2, occupants: 2, type: "Double", status: "Full", amenities: ["AC", "Attached Bathroom"] },
      { roomNumber: "102", floor: 1, capacity: 2, occupants: 0, type: "Double", amenities: ["AC"] },
      { roomNumber: "103", floor: 1, capacity: 2, occupants: 0, type: "Double", amenities: ["Balcony"] },
      { roomNumber: "104", floor: 1, capacity: 2, occupants: 0, type: "Double", amenities: ["AC"] },
      { roomNumber: "105", floor: 1, capacity: 2, occupants: 0, type: "Double", amenities: ["Attached Bathroom"] },
      { roomNumber: "106", floor: 1, capacity: 2, occupants: 0, type: "Double", amenities: ["AC", "Balcony"] },
      { roomNumber: "107", floor: 2, capacity: 1, occupants: 1, type: "Single", status: "Full", amenities: ["AC", "Balcony"] },
      { roomNumber: "108", floor: 2, capacity: 1, occupants: 0, type: "Single", amenities: ["AC"] },
    ]);
    console.log("Rooms created: 8");

    const students = await Student.create([
      { name: "John Doe", email: "john@example.com", password: "student123", phone: "1234567890", gender: "Male", course: "Computer Science", year: "2nd", roomNumber: "101", status: "Active" },
      { name: "Jane Smith", email: "jane@example.com", password: "student123", phone: "0987654321", gender: "Female", course: "Electrical Engineering", year: "3rd", roomNumber: "101", status: "Active" },
      { name: "Bob Wilson", email: "bob@example.com", password: "student123", phone: "5555555555", gender: "Male", course: "Mechanical Engineering", year: "1st", roomNumber: "107", status: "Active" },
    ]);
    console.log("Students created: 3");

    await Complaint.create([
      { student: students[0]._id, title: "AC not working", description: "The AC in room 101 is not cooling properly.", category: "Other", priority: "High", status: "Pending" },
      { student: students[1]._id, title: "Plumbing issue", description: "Water pipe leaking in bathroom.", category: "Plumbing", priority: "Urgent", status: "In Progress" },
      { student: students[2]._id, title: "Noise complaint", description: "Loud music after midnight.", category: "Noise", priority: "Medium", status: "Resolved" },
    ]);
    console.log("Complaints created: 3");

    const now = new Date();
    await LeaveRequest.create([
      { student: students[0]._id, reason: "Family function at home", fromDate: new Date(now.getTime() + 7*86400000), toDate: new Date(now.getTime() + 10*86400000), type: "Family", status: "Pending" },
      { student: students[1]._id, reason: "Medical checkup", fromDate: new Date(now.getTime() + 3*86400000), toDate: new Date(now.getTime() + 5*86400000), type: "Medical", status: "Approved" },
      { student: students[2]._id, reason: "Personal work", fromDate: new Date(now.getTime() + 14*86400000), toDate: new Date(now.getTime() + 16*86400000), type: "Personal", status: "Pending" },
    ]);
    console.log("Leave requests created: 3");

    await Fee.create([
      { student: students[0]._id, amount: 5000, paidAmount: 5000, dueDate: new Date(now.getTime() - 10*86400000), type: "Tuition", status: "Paid", paidAt: new Date(now.getTime() - 20*86400000) },
      { student: students[1]._id, amount: 4500, paidAmount: 2000, dueDate: new Date(now.getTime() + 5*86400000), type: "Hostel", status: "Partial" },
      { student: students[2]._id, amount: 3000, paidAmount: 0, dueDate: new Date(now.getTime() - 5*86400000), type: "Mess", status: "Overdue" },
    ]);
    console.log("Fee records created: 3");

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
