#!/bin/bash

# Konfigurasi
waktu_mulai=$(date +%s) # Waktu mulai dalam detik
durasi_24_jam=$((24 * 60 * 60)) # 24 jam dalam detik
tugas="echo 'Tugas dijalankan setiap jam'" # Tugas yang akan dijalankan

# Loop utama
while true; do
  waktu_sekarang=$(date +%s)
  selisih_waktu=$((waktu_sekarang - waktu_mulai))

  # Periksa apakah sudah 1 jam
  if ((selisih_waktu % 3600 == 0)); then
    eval "$tugas" # Jalankan tugas
    echo "Tugas dijalankan pada $(date)"
  fi

  # Periksa apakah sudah 24 jam
  if ((selisih_waktu >= durasi_24_jam)); then
    echo "Skrip selesai setelah 24 jam"
    break # Keluar dari loop
  fi

  sleep 60 # Tidur selama 1 menit
done

echo "Skrip berakhir"
