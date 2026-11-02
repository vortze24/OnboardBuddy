/* =====================================================
   OnboardBuddy – script.js
   Fitur: CRUD tugas, filter, progress bar,
          localStorage, chat Buddy, modal edit, toast,
          delete confirm, day tracker, quick-q buttons.
   ===================================================== */

"use strict";

// ─────────────────────────────────────────────
// 1. DATA – Default tasks & FAQ knowledge base
// ─────────────────────────────────────────────

/** 6 tugas onboarding awal yang ditampilkan saat pertama kali buka. */
const DEFAULT_TASKS = [
  { id: uid(), text: "Ambil laptop dan akun email kantor", completed: false },
  { id: uid(), text: "Kenalan dengan mentor dan tim divisi", completed: false },
  { id: uid(), text: "Baca aturan jam kerja dan kebijakan perusahaan", completed: false },
  { id: uid(), text: "Daftar akun Slack, Jira, dan alat kolaborasi lainnya", completed: false },
  { id: uid(), text: "Ikuti sesi orientasi HR hari pertama", completed: false },
  { id: uid(), text: "Pelajari roadmap proyek tim bersama mentor", completed: false },
];

/**
 * Daftar FAQ untuk fitur "Tanya Buddy".
 * Setiap entri memiliki keyword (array) dan jawaban (answer).
 */
const FAQ = [
  // ── Sapaan & basa-basi ──────────────────────────────────────────────────
  {
    keywords: ["halo", "hai", "hello", "hi", "hey", "selamat pagi", "selamat siang", "selamat sore"],
    answer:
      "Halo juga! 😊 Saya Buddy, siap membantu kamu selama onboarding. Ada yang ingin kamu tanyakan?",
  },
  {
    keywords: ["terima kasih", "makasih", "thanks", "thank you", "thx"],
    answer:
      "Sama-sama! Senang bisa membantu 😄 Kalau ada pertanyaan lain, jangan ragu untuk tanya ya!",
  },

  // ── Absensi ─────────────────────────────────────────────────────────────
  {
    keywords: ["absen", "hadir", "fingerprint", "presensi", "clock in", "clock out"],
    answer:
      "Absensi dilakukan via aplikasi HRD Connect. Tap 'Clock In' saat tiba dan 'Clock Out' saat pulang. Pastikan kamu sudah terhubung ke WiFi kantor saat melakukan absensi.",
  },

  // ── Cuti & izin ─────────────────────────────────────────────────────────
  {
    keywords: ["cuti", "izin", "libur", "ijin", "leave"],
    answer:
      "Pengajuan cuti dilakukan minimal 3 hari kerja sebelumnya melalui portal HRD atau langsung menghubungi HR. Cuti tahunan 12 hari tersedia setelah masa kerja 3 bulan.",
  },

  // ── WiFi & jaringan ──────────────────────────────────────────────────────
  {
    keywords: ["wifi", "wi-fi", "internet", "jaringan", "password wifi", "koneksi"],
    answer:
      "Nama jaringan WiFi kantor adalah 'OfficeNet_Corp'. Minta password-nya ke tim IT Support di lantai 2, atau cek email onboarding yang sudah dikirimkan ke akun kantormu.",
  },

  // ── Jadwal pelatihan ────────────────────────────────────────────────────
  {
    keywords: ["pelatihan", "training", "jadwal training", "jadwal pelatihan", "workshop", "kelas"],
    answer:
      "Jadwal pelatihan tersedia di portal Learning Management System (LMS). Login menggunakan akun email kantor, lalu pilih menu 'Training Schedule'. Pelatihan wajib pertama dijadwalkan minggu ke-2 onboarding.",
  },

  // ── Gaji & payroll ──────────────────────────────────────────────────────
  {
    keywords: ["gaji", "slip gaji", "payslip", "payroll", "salary", "kompensasi"],
    answer:
      "Slip gaji dikirim tiap akhir bulan ke email kantormu. Kamu juga bisa mengunduhnya di portal HRD menu 'Payslip'. Untuk pertanyaan lebih detail, hubungi tim Finance/HRD.",
  },

  // ── Fasilitas kantor ────────────────────────────────────────────────────
  {
    keywords: ["toilet", "kantin", "makan siang", "parkir", "fasilitas", "musholla", "ruang ibadah"],
    answer:
      "Kantin di lantai 1 buka pukul 07.00–20.00. Parkir karyawan di basement B1 (tunjukkan kartu karyawan). Musholla ada di lantai 3. Toilet tersedia di setiap lantai dekat area lift.",
  },

  // ── Dress code ──────────────────────────────────────────────────────────
  {
    keywords: ["dress code", "pakaian", "baju", "seragam", "penampilan", "outfit", "berpakaian"],
    answer:
      "Dress code kantor: Senin–Kamis menggunakan pakaian formal atau smart-casual (kemeja/blus, celana/rok bahan). Jumat diperbolehkan kasual. Hindari sandal, kaos polos, dan celana jeans sobek.",
  },

  // ── Printer & perangkat ─────────────────────────────────────────────────
  {
    keywords: ["printer", "print", "cetak", "fotokopi", "scanner", "scan"],
    answer:
      "Printer jaringan tersedia di setiap lantai. Hubungkan ke printer 'PrinterOffice_LT[nomor lantai]' dari WiFi kantor. Untuk akses pertama, minta kode PIN ke IT Support. Kuota cetak 50 halaman/hari.",
  },

  // ── Kontak IT Support ───────────────────────────────────────────────────
  {
    keywords: ["it", "it support", "helpdesk", "teknisi", "kontak it", "bantuan it", "komputer", "laptop rusak"],
    answer:
      "Hubungi IT Support di: ext. 1234 (telepon internal), itsupport@company.com, atau datang langsung ke ruang IT di lantai 2. Jam layanan: Senin-Jumat pukul 08.00-17.00.",
  },

  // ── Lembur ──────────────────────────────────────────────────────────────
  {
    keywords: ["lembur", "overtime", "kerja malam", "tambahan jam"],
    answer:
      "Lembur harus disetujui oleh manajer langsung minimal 1 hari sebelumnya melalui form di portal HRD. Kompensasi lembur sesuai aturan ketenagakerjaan dan dibayarkan bersamaan dengan gaji bulanan.",
  },

  // ── BPJS & asuransi ─────────────────────────────────────────────────────
  {
    keywords: ["bpjs", "asuransi", "kesehatan", "klaim", "jaminan"],
    answer:
      "BPJS Kesehatan & Ketenagakerjaan didaftarkan oleh HR pada hari pertama kerja. Kartu fisik dikirim dalam 2-3 minggu. Untuk klaim asuransi tambahan, hubungi HRD dengan membawa bukti tagihan asli.",
  },
];

// ─────────────────────────────────────────────
// 2. STATE
// ─────────────────────────────────────────────

/**
 * @type {Array<{id: string, text: string, completed: boolean}>}
 * Sumber kebenaran tunggal untuk semua tugas.
 */
let tasks = [];

/** Filter aktif saat ini: 'all' | 'pending' | 'completed' */
let activeFilter = "all";

/** ID tugas yang sedang diedit melalui modal. */
let editingTaskId = null;

// ─────────────────────────────────────────────
// 3. UTILITY FUNCTIONS
// ─────────────────────────────────────────────

/** Buat ID unik sederhana berbasis waktu + random. */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Simpan array tugas ke localStorage.
 * @param {Array} taskArray
 */
function saveTasks(taskArray) {
  localStorage.setItem("onboardbuddy_tasks", JSON.stringify(taskArray));
}

/**
 * Muat tugas dari localStorage.
 * Kalau belum ada, kembalikan DEFAULT_TASKS.
 * @returns {Array}
 */
function loadTasks() {
  const raw = localStorage.getItem("onboardbuddy_tasks");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [...DEFAULT_TASKS];
    }
  }
  return [...DEFAULT_TASKS];
}

/**
 * Tampilkan toast notification singkat.
 * @param {string} message - Teks pesan
 * @param {number} [duration=2500] - Durasi tampil (ms)
 */
function showToast(message, duration = 2500) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("toast-visible");
  setTimeout(() => toast.classList.remove("toast-visible"), duration);
}

// ─────────────────────────────────────────────
// 4. PROGRESS BAR
// ─────────────────────────────────────────────

/** Hitung dan render ulang progress bar sesuai data tasks terkini. */
function renderProgress() {
  const total = tasks.length;
  const done  = tasks.filter((t) => t.completed).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById("progress-bar").style.width   = `${pct}%`;
  document.getElementById("progress-label").textContent  = `${pct}%`;
  document.getElementById("progress-summary").textContent =
    `${done} dari ${total} tugas selesai`;

  // Tampilkan/sembunyikan pesan selamat saat 100%
  const congratsEl = document.getElementById("congrats-msg");
  if (total > 0 && pct === 100) {
    congratsEl.classList.remove("hidden");
  } else {
    congratsEl.classList.add("hidden");
  }
}

// ─────────────────────────────────────────────
// 5. TASK RENDERING
// ─────────────────────────────────────────────

/**
 * Buat satu elemen <li> untuk tugas tertentu.
 * @param {{id:string, text:string, completed:boolean}} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task-item${task.completed ? " completed-task" : ""}`;
  li.dataset.id = task.id;

  // Checkbox toggle selesai/belum
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Tandai selesai: ${task.text}`);
  checkbox.addEventListener("change", () => toggleTask(task.id));

  // Teks tugas
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  // Container aksi (edit & hapus)
  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "btn-action btn-edit";
  editBtn.textContent = "Edit";
  editBtn.setAttribute("aria-label", `Edit tugas: ${task.text}`);
  editBtn.addEventListener("click", () => openEditModal(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-action btn-delete";
  deleteBtn.textContent = "Hapus";
  deleteBtn.setAttribute("aria-label", `Hapus tugas: ${task.text}`);
  // Buka modal konfirmasi sebelum benar-benar menghapus
  deleteBtn.addEventListener("click", () => openDeleteModal(task.id, task.text));

  actions.append(editBtn, deleteBtn);
  li.append(checkbox, span, actions);

  return li;
}

/**
 * Render ulang semua tugas sesuai filter aktif.
 * Dipanggil setiap kali state berubah.
 */
function renderTasks() {
  const list          = document.getElementById("task-list");
  const emptyState    = document.getElementById("empty-state");
  const emptyStateText = document.getElementById("empty-state-text");

  // Filter berdasarkan activeFilter
  const filtered = tasks.filter((t) => {
    if (activeFilter === "pending")   return !t.completed;
    if (activeFilter === "completed") return t.completed;
    return true; // 'all'
  });

  // Kosongkan list lama
  list.innerHTML = "";

  if (filtered.length === 0) {
    // Teks empty state berbeda jika benar-benar belum ada tugas sama sekali
    emptyStateText.textContent =
      tasks.length === 0
        ? "Belum ada tugas, yuk tambah satu! 🚀"
        : "Belum ada tugas di kategori ini.";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filtered.forEach((t) => list.appendChild(createTaskElement(t)));
  }

  renderProgress();
}

// ─────────────────────────────────────────────
// 6. CRUD OPERATIONS
// ─────────────────────────────────────────────

/**
 * Tambah tugas baru ke array dan render ulang.
 * @param {string} text - Teks tugas (sudah di-trim)
 */
function addTask(text) {
  const newTask = { id: uid(), text, completed: false };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
  showToast("✅ Tugas berhasil ditambahkan!");
}

/**
 * Toggle status selesai/belum tugas berdasarkan ID.
 * @param {string} id
 */
function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks(tasks);
  renderTasks();
}

/**
 * Hapus tugas berdasarkan ID (dipanggil setelah konfirmasi modal).
 * @param {string} id
 */
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  renderTasks();
  showToast("🗑️ Tugas dihapus.");
}

/**
 * Simpan perubahan teks dari modal edit.
 * @param {string} id - ID tugas yang sedang diedit
 * @param {string} newText - Teks baru yang sudah di-trim
 */
function saveEditTask(id, newText) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, text: newText } : t
  );
  saveTasks(tasks);
  renderTasks();
  showToast("✏️ Tugas berhasil diperbarui!");
}

// ─────────────────────────────────────────────
// 7. FILTER
// ─────────────────────────────────────────────

/**
 * Set filter aktif dan perbarui tampilan tombol + list.
 * @param {string} filter - 'all' | 'pending' | 'completed'
 */
function setFilter(filter) {
  activeFilter = filter;

  // Perbarui visual tombol filter
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active-filter", btn.dataset.filter === filter);
  });

  renderTasks();
}

// ─────────────────────────────────────────────
// 7b. DELETE CONFIRMATION MODAL
// ─────────────────────────────────────────────

/** ID tugas yang sedang menunggu konfirmasi hapus. */
let pendingDeleteId = null;

/**
 * Buka modal konfirmasi hapus.
 * @param {string} id   - ID tugas
 * @param {string} text - Teks tugas untuk ditampilkan di modal
 */
function openDeleteModal(id, text) {
  pendingDeleteId = id;
  // Tampilkan teks tugas agar pengguna yakin yang dihapus benar
  document.getElementById("delete-modal-text").textContent =
    `"${text}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`;

  const modal = document.getElementById("delete-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.getElementById("delete-confirm").focus();
}

/** Tutup modal konfirmasi hapus tanpa melakukan apa-apa. */
function closeDeleteModal() {
  pendingDeleteId = null;
  const modal = document.getElementById("delete-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// ─────────────────────────────────────────────
// 8. EDIT MODAL
// ─────────────────────────────────────────────

/**
 * Buka modal edit dan isi dengan teks tugas saat ini.
 * @param {string} id
 */
function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingTaskId = id;
  document.getElementById("edit-input").value = task.text;

  const modal = document.getElementById("edit-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.getElementById("edit-input").focus();
}

/** Tutup modal edit tanpa menyimpan. */
function closeEditModal() {
  editingTaskId = null;
  const modal = document.getElementById("edit-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// ─────────────────────────────────────────────
// 8b. SCHEDULE SESSION MODAL
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 8c. DAY TRACKER (Hari ke-X dari 30)
// ─────────────────────────────────────────────

const STORAGE_START_DATE = "onboardbuddy_start_date";

/**
 * Hitung hari ke-berapa dari 30 berdasarkan tanggal mulai di localStorage.
 * Jika belum ada, set hari ini sebagai tanggal mulai.
 */
function renderDayTracker() {
  let startDateStr = localStorage.getItem(STORAGE_START_DATE);

  // Pertama kali: simpan tanggal hari ini sebagai tanggal mulai
  if (!startDateStr) {
    startDateStr = new Date().toISOString().split("T")[0];
    localStorage.setItem(STORAGE_START_DATE, startDateStr);
  }

  // Hitung selisih hari (floor agar hari pertama = hari ke-1)
  const start    = new Date(startDateStr + "T00:00:00");
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs   = today - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const dayNum   = Math.min(diffDays + 1, 30); // cap 30

  const trackerText = document.getElementById("day-tracker-text");
  if (dayNum >= 30) {
    trackerText.textContent = "Hari ke-30 dari 30 — Selamat! 🎓";
  } else {
    trackerText.textContent = `Hari ke-${dayNum} dari 30`;
  }
}

/** Buka modal penjadwalan sesi dengan mentor. */
function openScheduleModal() {
  // Set tanggal minimum ke hari ini
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("schedule-date").min = today;
  document.getElementById("schedule-date").value = "";
  document.getElementById("schedule-time").value = "";

  const modal = document.getElementById("schedule-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.getElementById("schedule-date").focus();
}

/** Tutup modal penjadwalan tanpa menyimpan. */
function closeScheduleModal() {
  const modal = document.getElementById("schedule-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// ─────────────────────────────────────────────
// 9. BUDDY CHAT
// ─────────────────────────────────────────────

/**
 * Cari jawaban FAQ berdasarkan cocok kata kunci.
 * Fungsi normalisasi sederhana: huruf kecil, hapus tanda baca.
 * @param {string} userMessage
 * @returns {string} Jawaban Buddy
 */
function getBuddyAnswer(userMessage) {
  const normalized = userMessage.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  for (const item of FAQ) {
    const matched = item.keywords.some((kw) => normalized.includes(kw));
    if (matched) return item.answer;
  }

  // Fallback – sarankan tanya mentor
  return "Hmm, saya belum punya info soal itu. Coba tanyakan langsung ke mentormu, Rizky Dermawan, ya! 😊";
}

/**
 * Tambahkan bubble baru ke kotak chat.
 * @param {string} text - Isi pesan
 * @param {'buddy'|'user'} sender - Pengirim
 */
function appendChatBubble(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const bubble  = document.createElement("div");
  bubble.className = sender === "buddy" ? "buddy-bubble" : "user-bubble";
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  // Auto-scroll ke pesan terbaru
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Proses pesan pengguna: tampilkan bubble user, tunggu sebentar,
 * lalu tampilkan balasan Buddy.
 * @param {string} message
 */
function handleChatMessage(message) {
  appendChatBubble(message, "user");

  // Simulasikan "typing delay" agar terasa natural
  setTimeout(() => {
    const answer = getBuddyAnswer(message);
    appendChatBubble(answer, "buddy");
  }, 400);
}

// ─────────────────────────────────────────────
// 10. EVENT LISTENERS
// ─────────────────────────────────────────────

/** Inisialisasi semua event listener setelah DOM siap. */
function initEventListeners() {

  // --- Form tambah tugas ---
  document.getElementById("task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("task-input");
    const text  = input.value.trim();
    if (!text) {
      showToast("⚠️ Tugas tidak boleh kosong!");
      input.focus();
      return;
    }
    addTask(text);
    input.value = "";
    input.focus();
  });

  // --- Tombol filter ---
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
  });

  // --- Modal: simpan edit ---
  document.getElementById("modal-save").addEventListener("click", () => {
    const newText = document.getElementById("edit-input").value.trim();
    if (!newText) {
      showToast("⚠️ Tugas tidak boleh kosong!");
      document.getElementById("edit-input").focus();
      return;
    }
    saveEditTask(editingTaskId, newText);
    closeEditModal();
  });

  // --- Modal: batal / klik backdrop ---
  document.getElementById("modal-cancel").addEventListener("click", closeEditModal);
  document.getElementById("edit-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeEditModal();
  });

  // --- Modal: tutup dengan Escape (semua modal) ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEditModal();
      closeScheduleModal();
      closeDeleteModal();
    }
  });

  // --- Modal: simpan dengan Enter ---
  document.getElementById("edit-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("modal-save").click();
  });

  // --- Form chat Buddy ---
  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input   = document.getElementById("chat-input");
    const message = input.value.trim();
    if (!message) return;
    handleChatMessage(message);
    input.value = "";
    input.focus();
  });

  // --- Tombol pertanyaan cepat (Quick Q) ---
  document.querySelectorAll(".quick-q-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const question = btn.dataset.q;
      handleChatMessage(question);
    });
  });

  // --- Delete modal: konfirmasi hapus ---
  document.getElementById("delete-confirm").addEventListener("click", () => {
    if (pendingDeleteId) {
      deleteTask(pendingDeleteId);
    }
    closeDeleteModal();
  });

  // --- Delete modal: batal / klik backdrop ---
  document.getElementById("delete-cancel").addEventListener("click", closeDeleteModal);
  document.getElementById("delete-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeDeleteModal();
  });

  // --- Reset tanggal mulai onboarding ---
  document.getElementById("reset-start-date").addEventListener("click", () => {
    if (confirm("Reset tanggal mulai onboarding ke hari ini?")) {
      localStorage.removeItem(STORAGE_START_DATE);
      renderDayTracker();
      showToast("📆 Tanggal mulai onboarding direset ke hari ini.");
    }
  });

  // --- Tombol jadwalkan sesi: buka modal ---
  document.getElementById("schedule-btn").addEventListener("click", openScheduleModal);

  // --- Schedule modal: konfirmasi ---
  document.getElementById("schedule-confirm").addEventListener("click", () => {
    const dateVal = document.getElementById("schedule-date").value;
    const timeVal = document.getElementById("schedule-time").value;

    if (!dateVal) {
      showToast("Pilih tanggal terlebih dahulu!");
      return;
    }
    if (!timeVal) {
      showToast("Pilih jam terlebih dahulu!");
      return;
    }

    // Format tanggal ke bahasa Indonesia
    const formatted = new Date(dateVal + "T00:00:00").toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    closeScheduleModal();
    showToast(
      "Sesi berhasil dijadwalkan dengan Rizky Dermawan pada " + formatted + " pukul " + timeVal + "!",
      4000
    );
  });

  // --- Schedule modal: batal / klik backdrop ---
  document.getElementById("schedule-cancel").addEventListener("click", closeScheduleModal);
  document.getElementById("schedule-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeScheduleModal();
  });
}

// ─────────────────────────────────────────────
// 11. INIT – Entry point
// ─────────────────────────────────────────────

/**
 * Muat data, pasang event listener, dan render tampilan awal.
 * Dipanggil saat DOM siap.
 */
function init() {
  tasks = loadTasks();

  // Simpan default tasks ke localStorage jika belum ada
  if (!localStorage.getItem("onboardbuddy_tasks")) {
    saveTasks(tasks);
  }

  initEventListeners();
  renderDayTracker();
  renderTasks();
}

// Jalankan setelah DOM selesai di-parse
document.addEventListener("DOMContentLoaded", init);
