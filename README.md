# OnboardBuddy

Teman pendamping untuk karyawan baru dan peserta magang selama 30 hari pertama bekerja.

Demo: https://vortze24.github.io/OnboardBuddy/

## Ringkasan
OnboardBuddy adalah AI Agent yang mendampingi karyawan baru atau peserta magang selama 30 hari pertama. Nantinya menjawab pertanyaan seputar aturan perusahaan, alur kerja, dan tools yang dipakai, serta memberi checklist tugas harian yang disesuaikan dengan peran masing-masing.

Dengan adanya AI Agent ini diharapkan dapat mempercepat adaptasi karyawan baru tanpa membebani tim senior untuk menjawab pertanyaan berulang. Pengguna utamanya adalah karyawan baru, peserta magang, dan tim HR/mentor. Fungsi utama agent antara lain menjawab FAQ, memberi to-do list per hari, mengingatkan tugas penting, dan merangkum progres onboarding untuk mentor.

## Fitur
- Checklist onboarding (tambah, ubah, hapus, tandai selesai, filter semua/belum/selesai)
- Progress bar otomatis, data tersimpan di localStorage
- Tanya Buddy: chat FAQ berbasis kata kunci
- Kartu mentor dan penjadwalan sesi

## Teknologi
HTML, Tailwind CSS, Vanilla JavaScript. Dibuat dengan IBM Bob.

## Cara Menjalankan
1. Unduh atau clone repository ini.
2. Buka `index.html` di browser (atau pakai Live Server di VS Code).

## Arsitektur Prompt
Layer 1:
Menempatkan peran IBM Bob sebagai Senior Frontend Engineer yang terbiasa membangun website dengan HTML, Tailwind CSS, dan Vanilla JavaScript. AI diarahkan untuk fokus pada standar kerja diantaranya kode yang rapi, mudah dibaca, mengikuti best practice, dan langsung bisa dijalankan.Tujuannya agar Bob punya sudut pandang dan standar kualitas yang jelas sejak awal.

Layer 2:
Layer ini menjelaskan apa yang harus dibuat, yaitu website OnboardBuddy untuk mendampingi karyawan baru dan peserta magang selama 30 hari pertama. Isinya mencakup tiga file (index.html, style.css, script.js), checklist onboarding dengan fitur CRUD, penanda selesai/belum, filter untuk membagi kategori semua/belum/selesai, progress bar otomatis, penyimpanan di localStorage, kotak chat “Tanya Buddy” berbasis FAQ dan kata kunci, serta kartu profil mentor. 

Layer 3:
Layer ini mengatur tampilan dan kualitas hasil yakni modern, minimalis, responsif (mobile-first), warna biru-putih dengan aksen oranye, card dengan sudut membulat dan bayangan halus, serta efek hover dan transisi. Sementara dari sisi kode antara lain HTML semantik, Tailwind sebagai styling utama, nama variabel jelas, ada komentar, tidak ada kode yang tidak terpakai, dan bebas error.

## Iterasi Prompt
Penyempurnaan pertama yakni tombol “Jadwalkan Sesi” yang belum melakukan apa-apa ketika diklik. Sehingga pada layer 2 ditambahkan instruksi agar tombol tersebut membuka jendela kecil yang berisi pilihan tanggal dan jam. Lalu setelah dikonfirmasi muncul pesan “Sesi berhasil dijadwalkan dengan (nama mentor)”. Dampaknya, penjadwalan jadi terasa nyata dan bisa didemokan dari awal sampai akhir, bukan hanya tombol hiasan.

Penyempurnaan kedua yakni pada kotak “Tanya Buddy”. Daftar FAQ-nya masih sangat terbatas sehingga banyak pertanyaan umum yang tidak terjawab. Pada layer 2, daftar FAQ diperluas menjadi minimal 10 topik, antara lain gaji, dress code, cara pakai printer, dan kontak IT. Dampaknya, jawaban dari Buddy menjadi lebih luas dan lebih berguna untuk kebutuhan sehari-hari di minggu pertama bekerja. 
Selain aspek cakupan pertanyaan, dari aspek balasan Buddy masih terasa kaku karena tidak bisa merespons sapaan. Jadi ditambahkan balasan untuk sapaan seperti halo dan terimakasih pada layer 2, sehingga percakapan terasa lebih natural dan ramah.

Penyempurnaan terakhir ada pada detail kecil, yaitu tahun pada footer yang perlu disesuaikan menjadi 2026. Perubahan ini juga ditulis di layer 2 sebagai bagian dari instruksi isi konten. 

## Potensi Pengembangan Lanjutan
Saat ini Buddy hanya mencocokkan kata kunci dari daftar FAQ, sehingga jawabannya masih terbatas. Pengembangan selanjutnya, Buddy bisa dihubungkan ke model bahasa AI agar memahami maksud pertanyaan dan bisa menjawab pertanyaan lanjutan dengan lebih natural. Selain itu, agar tetap terpercaya, Buddy diberi dokumen pendukung seperti panduan karyawan dan SOP, serta aturan menjawab yang jelas. Misalnya hanya menjawab berdasarkan dokumen, jujur mengakui jika tidak tahu lalu mengarahkan ke mentor atau HR, dan tidak memberi keputusan untuk hal sensitif. Dengan begitu percakapan jadi interaktif, tetapi tidak sembarangan.

Selain itu, Buddy juga bisa diintegrasikan dengan WhatsApp, sehingga karyawan baru bisa bertanya dan menerima pengingat tugas langsung lewat aplikasi yang sudah mereka pakai, tanpa harus membuka website khusus.