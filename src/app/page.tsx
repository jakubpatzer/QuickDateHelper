"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import ConfirmationModal from "@/components/ConfirmationModal";
import jsPDF from "jspdf";

interface DataItem {
  id: number;
  name: string;
  checked: boolean;
  notes: string;
}

const initialData: DataItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Numer ${i + 1}`,
  checked: false,
  notes: "",
}));

const ITEMS_PER_PAGE = 1;
const LOCAL_STORAGE_KEY = "paginatedData";

const PaginatedPage = () => {
  const [data, setData] = useState<DataItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : initialData;
    }
    return initialData;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showChecked, setShowChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Ensure data is loaded from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const totalPages = data.length;

  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCheckChange = (id: number) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleNotesChange = (id: number, notes: string) => {
    setData(data.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  const handleReset = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleConfirmReset = () => {
    const resetData = initialData.map((item) => ({
      ...item,
      checked: false,
      notes: "",
    }));
    setData(resetData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentPage(1);
    setIsModalOpen(false); // Close the modal after reset
  };

  const handleCancelReset = () => {
    setIsModalOpen(false); // Close the modal if cancel is clicked
  };

  const handleShowChecked = () => {
    setShowChecked(!showChecked);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    if (data) {
      // Customize the content and formatting of the PDF
      const formated = data
        .filter((e: DataItem) => e.checked)
        .map((e: DataItem) => `${e.name} ${e.notes && `(${e.notes})`}`)
        .join("\n\n");
      doc.text(formated, 10, 10);
    } else {
      doc.text("No data available", 10, 10);
    }

    // Save the generated PDF
    doc.save("data.pdf");
  };

  const checkedItems = data.filter((item) => item.checked);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Speed dating helper
      </h1>
      <ul>
        {currentData.map((item) => (
          <li key={item.id} className="border rounded-lg py-2 px-2 mb-2">
            <div className="flex items-center mb-2">
              <span className="mr-8 text-xl">{item.name}</span>
              <input
                className="mr-2 custom-checkbox"
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckChange(item.id)}
              />
            </div>
            <textarea
              className="w-full border rounded p-2 text-black"
              placeholder="Notatki..."
              value={item.notes}
              onChange={(e) => handleNotesChange(item.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div className="flex flex-col mt-4 md:flex-row md:justify-center md:space-x-4">
        <button
          className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mb-4 md:mb-0"
          onClick={handleReset}
        >
          Resetuj wszystko
        </button>
        <button
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 md:mb-0"
          onClick={handleShowChecked}
        >
          {showChecked ? "Ukryj listę" : "Pokaz listę"}
        </button>
      </div>
      {showChecked && (
        <div className="mt-4 text-center mb-8">
          <h2 className="text-lg font-bold mb-2">Twoja lista:</h2>
          {checkedItems.length > 0 ? (
            <ul>
              {checkedItems.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          ) : (
            <p>Jeszcze nikogo nie zaznaczyłeś.</p>
          )}
        </div>
      )}
      <button
        className="w-42 md:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        onClick={generatePDF}
      >
        Pobierz PDF z listą
      </button>

      {/* Modal component */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={handleCancelReset}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default PaginatedPage;
