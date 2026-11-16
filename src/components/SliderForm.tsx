"use client";

import { addSlider } from "@/app/admin/slider/actions";
import { useActionState } from "react";

export default function SliderForm() {
  const [state, formAction, pending] = useActionState(addSlider, {});
  return (
    <div>
      <h1>Slider Form</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="mb-3">
          <label>Title</label>
          <input name="title" type="text" />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <input name="description" type="text" />
        </div>
        <div className="mb-3">
          <label>CTO Link</label>
          <input name="cto" type="url" />
        </div>
        <div className="mb-3">
          <label
            htmlFor="image"
            className="bg-amber-600 text-white px-2 rounded-2xl py-2"
          >
            Upload
          </label>
          <input type="file" id="image" name="image" className="hidden" />
        </div>
        <div className="mb-3">
          <label>Order</label>
          <input name="order" type="number" />
        </div>
        <div className="mb-3">
          <label>End Date</label>
          <input name="endDate" type="date" />
        </div>

        <div className="mb-3">
          <label>Active</label>
          <select defaultValue="true" name="isActive">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        {state.error && <span>{state.error}</span>}
        {state.message && <span>{state.message}</span>}

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
