"use client";

import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    axios.post("/api/sendMessageToTelegram");
  }, []);
  return;
}
