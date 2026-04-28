import axiosInstance from "./axiosInstance";

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post("/api/bookings", bookingData);
    return response.data;
  },
  
  // Get all bookings (for user/admin views)
  getAllBookings: async () => {
    const response = await axiosInstance.get("/api/bookings");
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id, status, locationSuggestions = null, adminNote = null) => {
    const payload = { status };
    if (locationSuggestions) payload.locationSuggestions = locationSuggestions;
    if (adminNote) payload.adminNote = adminNote;
    const response = await axiosInstance.patch(`/api/bookings/${id}/status`, payload);
    return response.data;
  },

  // Update booking message
  updateBookingMessage: async (id, message) => {
    const response = await axiosInstance.patch(`/api/bookings/${id}/message`, { message });
    return response.data;
  },

  updateStudentSelection: async (id, selection) => {
    const response = await axiosInstance.patch(`/api/bookings/${id}/selection`, { selection });
    return response.data;
  },
  
  // Delete a booking
  deleteBooking: async (id) => {
    const response = await axiosInstance.delete(`/api/bookings/${id}`);
    return response.data;
  }
};
