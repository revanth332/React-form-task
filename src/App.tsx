import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define the schema for validation using Zod
const schema = z.object({
  name: z.string().min(1, "Text is required"),
  age: z
    .number()
    .min(1, "Number is required")
    .max(100, "Must be less than 100"),
  email: z.string().email("Invalid email address"),
  password: z.string().refine((pwd) => {
    const pattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    return pattern.test(pwd);
  }, "Password didnt meet the criteria"),
  dob: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)) && Date.parse(val) < Date.now(),
      "Invalid date"
    ),
  color: z.string(),
  course: z.string().array().min(1,"Must select atleast one course"),
  gender: z.enum(["Male", "Female"]),
  file: z.any().refine((file) => file?.size > 0, "File is required"),
  range: z.string(),
  url: z.string().url("Invalid URL"),
  time: z.string(),
  dateTime: z.string().refine((date) => !isNaN(Date.parse(date)),"Ivalid date time"),
  timeZone: z.string(),
});

type FormData = z.infer<typeof schema>;

const App: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [fileType, setFileType] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: 0,
    email: "",
    password: "",
    dob: "",
    color: "#000000",
    course: [],
    gender: "Male",
    file: null,
    range: "50",
    url: "",
    time: "",
    dateTime: "",
    timeZone: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const timeZones = [
    { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
    { value: "America/New_York", label: "New York (EST)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEDT)" },
  ];

  const fileTypes = [
    { label: "Images", value: "image/*" },
    { label: "PDF", value: "application/pdf" },
    { label: "Text Files", value: "text/plain" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prevData: FormData) => {
        const updatedArray: string[] = checked
          ? [...prevData[name as keyof FormData], value]
          : (prevData[name as keyof FormData] as string[]).filter(
              (item) => item !== value
            );

        return {
          ...prevData,
          [name]: updatedArray,
        };
      });
    } else {
      if (type === "file") {
        console.log(files);
      }
      // Handle other input types if necessary
      setFormData({
        ...formData,
        [name]:
          type === "file" ? files?.[0] : type === "number" ? +value : value,
      });
    }
  };

  useEffect(() => {
    if (fileType) {
      fileRef.current?.click();
      closeRef.current?.click();
    }
  }, [fileType]);

  const handleFileType = (type: string) => {
    setFileType(() => {
      return type;
    });
  };

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeZone(e.target.value);
  };

  const handleReset = () => {
    console.log("reset");
    setFormData({
      name: "",
      age: 0,
      email: "",
      password: "",
      dob: "",
      color: "#000000",
      course: [],
      gender: "Male",
      file: null,
      range: "0",
      url: "",
      time: "",
      dateTime: "",
      timeZone: "",
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("no safe", formData);
    const validationResult = schema.safeParse(formData);

    if (validationResult.success) {
      console.log("Form data is valid:", formData);
      console.log("safe", formData);
      setErrors({});
    } else {
      const formattedErrors: Partial<Record<keyof FormData, string>> = {};
      validationResult.error.errors.forEach((error) => {
        const fieldName = error.path[0] as keyof FormData;
        formattedErrors[fieldName] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  const getConvertedDateTime = () => {
    if (!formData.dateTime) return "";

    const date = new Date(formData.dateTime);
    const dateStr = date.toLocaleString("en-US", { timeZone });
    return dateStr;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 max-w-lg mx-auto bg-white shadow-md rounded-md"
    >
      <div className="flex flex-col">
        <label className="text-gray-700">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.age && (
          <p className="text-red-600 text-sm mt-1">{errors.age}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">DOB:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.dob && (
          <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Color:</label>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Courses:</label>
        <div className="flex items-center space-x-4 mt-1">
          <label className="text-gray-700 mr-2">
            <input
              type="checkbox"
              name="course"
              checked={formData.course.includes("React")}
              value="React"
              onChange={handleChange}
              className="focus:outline-none focus:ring focus:border-blue-300"
            />
            <span className="ml-2">React</span>
          </label>
          <label className="text-gray-700 mr-2">
            <input
              type="checkbox"
              name="course"
              value="Node"
              checked={formData.course.includes("Node")}
              onChange={handleChange}
              className="focus:outline-none focus:ring focus:border-blue-300"
            />
            <span className="ml-2">Node</span>
          </label>
          <label className="text-gray-700 mr-2">
            <input
              type="checkbox"
              name="course"
              value="Python"
              checked={formData.course.includes("Python")}
              onChange={handleChange}
              className="focus:outline-none focus:ring focus:border-blue-300"
            />
            <span className="ml-2">Python</span>
          </label>

        </div>
        {errors.course && (
            <p className="text-red-600 text-sm mt-1 ml-2">{errors.course}</p>
          )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Gender:</label>
        <div className="flex items-center space-x-4 mt-1">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
              className="focus:outline-none focus:ring focus:border-blue-300"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
              className="focus:outline-none focus:ring focus:border-blue-300"
            />
            <span className="ml-2">Female</span>
          </label>
        </div>
      </div>
      {errors.gender && (
          <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
        )}

      <div className="flex flex-col">
        <label className="text-gray-700">File:</label>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">chose file</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleFileType(fileTypes[0].value)}
                >
                  Image
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFileType(fileTypes[1].value)}
                >
                  Pdf
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFileType(fileTypes[2].value)}
                >
                  Text
                </Button>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button ref={closeRef} type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {errors.file && (
          <p className="text-red-600 text-sm mt-1">{errors.file}</p>
        )}
        {/* {formData.file && !(formData.file?.name.split(".")[1].includes(fileType)) && <p className="text-red-600 text-sm mt-1">invalid file type</p>} */}
      </div>
      <input
        type="file"
        name="file"
        accept={fileType}
        hidden={true}
        ref={fileRef}
        onChange={handleChange}
        className="focus:outline-none focus:ring focus:border-blue-300"
      />

      <div className="flex flex-col">
        <label className="text-gray-700">Range:</label>
        <input
          type="range"
          name="range"
          value={formData.range}
          onChange={handleChange}
          className="focus:outline-none focus:ring focus:border-blue-300"
          min="0"
          max="100"
        />
        {errors.range && (
          <p className="text-red-600 text-sm mt-1">{errors.range}</p>
        )}
        <p>progress : {formData.range + "%"}</p>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">URL:</label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.url && (
          <p className="text-red-600 text-sm mt-1">{errors.url}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700"> Date Time</label>
        <input
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.dateTime && (
          <p className="text-red-600 text-sm mt-1">{errors.dateTime}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Select Time Zone</label>
        <select
          name="timeZone"
          value={timeZone}
          onChange={handleTimeZoneChange}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        >
          {timeZones.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {zone.label}
            </option>
          ))}
        </select>
        <br />
        {getConvertedDateTime()}
      </div>

      <div className="flex flex-col">
        <input
          type="reset"
          name="reset"
          value={"Reset"}
          onClick={handleReset}
          className="border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.time && (
          <p className="text-red-600 text-sm mt-1">{errors.time}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md mt-6 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Submit
      </button>
    </form>
  );
};

export default App;
