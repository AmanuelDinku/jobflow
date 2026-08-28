import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications");

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch applications."
      );
    }
  }
);

export const createApplication = createAsyncThunk(
  "applications/createApplication",
  async (application, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/applications",
        application
      );

      return response.data.application;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to create application."
      );
    }
  }
);

export const updateApplication = createAsyncThunk(
  "applications/updateApplication",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/applications/${id}`,
        data
      );

      return response.data.application;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to update application."
      );
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/applications/${id}`);

      return id;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to delete application."
      );
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",

  initialState: {
    applications: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })

      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.unshift(action.payload);
      })

      .addCase(updateApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (app) => app.id === action.payload.id
        );

        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })

      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app.id !== action.payload
        );
      });
  }
});

export default applicationsSlice.reducer;