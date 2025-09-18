Mantap 🚀, kalau mau monitoring **NestJS pakai Prometheus + Grafana**, alurnya biasanya gini:

---

## 🔧 Step by Step Setup Monitoring NestJS + Prometheus + Grafana

### 1. Tambahkan Prometheus ke NestJS

Prometheus butuh API endpoint yang expose **metrics**.

Install library:

```bash
npm install prom-client @willsoto/nestjs-prometheus
```

Tambahkan ke `app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register()
  ],
})
export class AppModule {}
```

👉 Setelah itu NestJS otomatis punya endpoint di `http://localhost:3000/metrics` yang menampilkan metrics (CPU, memori, request, dll) dalam format Prometheus.

---

### 2. Install & Jalankan Prometheus

Prometheus akan **scrape** (ambil data) dari endpoint `/metrics`.

Buat file `prometheus.yml`:

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'nestjs'
    static_configs:
      - targets: ['host.docker.internal:3000'] # kalau jalan di Docker
        # atau langsung 'localhost:3000'
```

Jalankan Prometheus:

```bash
docker run -d \
  -p 9090:9090 \
  -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

👉 Akses di `http://localhost:9090` → kamu bisa query metric misalnya `http_requests_total`.

---

### 3. Install & Jalankan Grafana

Jalankan Grafana:

```bash
docker run -d -p 3001:3000 grafana/grafana
```

Login default:

* **Username**: `admin`
* **Password**: `admin`

---

### 4. Hubungkan Grafana dengan Prometheus

* Buka Grafana → `Configuration` → `Data Sources` → Add Prometheus.
* Isi URL: `http://host.docker.internal:9090` (atau `http://localhost:9090`).
* Save & Test.

---

### 5. Buat Dashboard

* Buka `Dashboards` → `New Dashboard`.
* Tambahkan panel.
* Query misalnya:

  * `http_requests_total` → total request ke API.
  * `process_cpu_seconds_total` → CPU usage.
  * `process_resident_memory_bytes` → RAM usage.

---

### 6. Tambahkan Alert (Opsional)

Grafana bisa bikin alert → misalnya kalau response time > 1 detik, kirim notifikasi ke Slack/Telegram/Email.

---

📊 Hasil akhirnya:

* Kamu punya **NestJS** yang expose metrics di `/metrics`.
* **Prometheus** ambil datanya.
* **Grafana** tampilkan grafik & alert real-time.

---

Mau aku bikinkan **kode NestJS lengkap dengan custom metric** (misalnya menghitung berapa kali endpoint `/login` dipanggil) biar lebih jelas cara kerjanya?
