"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import Switch from "@/components/Switch";
import generatePDF from "@/utils/generatePDF";

interface DataItem {
  id: number;
  name: string;
  checked: boolean;
  notes: string;
}

const TOTAL_PAGES: number = 24;

const initialData: DataItem[] = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  checked: false,
  notes: "",
}));

const ITEMS_PER_PAGE: number = 1;
const LOCAL_STORAGE_KEY: string = "paginatedData";

const PaginatedPage = () => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showChecked, setShowChecked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalVersion, setModalVersion] = useState<"reset" | "pdf">("reset");
  const [isBigHud, setIsBigHud] = useState<boolean>(false);

  const bigHud = {
    on: "text-2xl",
    off: "text-md",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (Array.isArray(parsed) && parsed.length === TOTAL_PAGES) {
            setData(parsed);
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setData(initialData);
          }
        } catch {
          setData(initialData);
        }
      } else {
        setData(initialData);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const totalPages: number = data.length;

  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const checkedItems: DataItem[] = data.filter((item: DataItem) => item.checked);
  const checkedIds: number[] = checkedItems.map(item => item.id);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleCheckChange = (id: number): void => {
    setData(
      data.map((item: DataItem) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleNotesChange = (id: number, notes: string): void => {
    setData(data.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  const handleReset = (): void => {
    setModalVersion("reset");
    setIsModalOpen(true);
  };

  const handleConfirmReset = (): void => {
    const resetData = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      checked: false,
      notes: "",
    }));
    setData(resetData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentPage(1);
    setIsModalOpen(false);
    setShowChecked(false);
  };

  const handleCancelReset = (): void => {
    setIsModalOpen(false);
  };

  const handleShowChecked = (): void => {
    setShowChecked(!showChecked);
  };

  const HandleDownloadPDF = () => {
    if (data && checkedItems.length > 0) {
      generatePDF(checkedItems);
    } else {
      setModalVersion("pdf");
      setIsModalOpen(true);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-white">
        Speed dating helper
      </h1>
      <div className="flex items-center justify-between mb-4 px-16">
        <span className="text-white">Big HUD</span>
        <Switch isChecked={isBigHud} onChange={setIsBigHud} />
      </div>
      <ul>
        {currentData.map((item: DataItem) => (
          <li key={item.id} className="border rounded-lg py-2 px-2 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="mr-8 text-xl text-white">{item.name}</span>
              <input
                className="mr-2 custom-checkbox"
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckChange(item.id)}
              />
            </div>
            <textarea
              className={`${isBigHud ? bigHud.on : bigHud.off} w-full border rounded p-2 text-black`}
              placeholder="Notes..."
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
        isBigHud={isBigHud}
        checkedIds={checkedIds}
      />
      <div className="flex flex-col mt-4 md:flex-row md:justify-center md:space-x-4">
        <button
          className={`${isBigHud ? bigHud.on : bigHud.off} w-full md:w-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mb-4 md:mb-0`}
          onClick={handleReset}
        >
          Reset all
        </button>
        <button
          className={`${isBigHud ? bigHud.on : bigHud.off} w-42 md:w-auto bg-green-600 hover:bg-green-700  text-white py-2 px-4 mb-4 rounded`}
          onClick={HandleDownloadPDF}
        >
          Download PDF
        </button>
        <button
          className={`${isBigHud ? bigHud.on : bigHud.off} w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 md:mb-0`}
          onClick={handleShowChecked}
        >
          {showChecked ? "Hide list" : "Show list"}
        </button>
      </div>
      {showChecked && (
        <div className="mt-4 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Your list:</h2>
          {checkedItems.length > 0 ? (
            <ul>
              {checkedItems.map((item: DataItem) => (
                <li
                  className={`${isBigHud ? bigHud.on : bigHud.off} text-white mb-4`}
                  key={item.id}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white text-xl">
              You haven&#39;t marked anyone yet.
            </p>
          )}
        </div>
      )}

      <Modal
        version={modalVersion}
        isOpen={isModalOpen}
        onCancel={handleCancelReset}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default PaginatedPage;