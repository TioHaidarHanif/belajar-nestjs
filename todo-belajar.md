- Dependency Injection
- Providers
- Knsep decoreatr itu seperti apa
- Middleware
- Interceptors
- Pipes
- Filters
- TypeORM atau prisma
- OAuth2



## 🔹 1. Alur Dasar Request di NestJS

Saat client (browser, Postman, mobile app) mengirim request HTTP ke server NestJS:

1. **Request masuk ke server (HTTP Adapter)**

   * NestJS menggunakan **HTTP Adapter** (default: Express, bisa juga Fastify).
   * Adapter ini yang menerima HTTP request dari jaringan.

2. **Middleware dijalankan**

   * Middleware **pre-processing** request, misal logging, authentication check, body parsing.
   * Middleware **jalan sebelum controller**.

3. **Guard dijalankan**

   * Guard digunakan untuk **authorization / akses kontrol**.
   * Guard memutuskan apakah request boleh diteruskan ke route handler atau tidak.

4. **Interceptors (pre-handler) dijalankan**

   * Interceptor bisa **mengubah request**, logging, transform data sebelum masuk controller.

5. **Controller menerima request**

   * NestJS mencocokkan **route** dan **HTTP method** → memanggil method di controller.
   * Controller bertanggung jawab untuk orchestrasi → memanggil **service**.

6. **Service / Provider dipanggil**

   * Service/Provider adalah class yang di-inject via **Dependency Injection**.
   * Service melakukan logika bisnis, panggil repository/DB, atau panggil API lain.

7. **Repository / Database diakses**

   * Jika menggunakan **TypeORM / Prisma**, service memanggil repository atau prisma client.
   * Query DB dijalankan, data dikembalikan ke service.

8. **Controller mengembalikan response**

   * Response bisa berupa object, array, string, stream, dll.
   * Interceptor (post-handler) bisa memodifikasi response sebelum dikirim ke client.

9. **Response dikirim oleh HTTP Adapter**

   * Adapter mengirim response kembali ke client (browser, Postman, dll).

---

## 🔹 2. Diagram Alur Singkat

```
Client Request
      │
      ▼
HTTP Adapter (Express/Fastify)
      │
      ▼
Middleware (pre-processing)
      │
      ▼
Guards (authorization)
      │
      ▼
Interceptors (pre-handler)
      │
      ▼
Controller (route handler)
      │
      ▼
Service / Provider (DI)
      │
      ▼
Repository / Database
      │
      ▼
Controller mengembalikan response
      │
      ▼
Interceptors (post-handler)
      │
      ▼
HTTP Adapter
      │
      ▼
Client Response
```

---

## 🔹 3. Catatan Penting

* **Dependency Injection (DI)** → service/repository otomatis di-inject ke controller.
* **Middleware** → untuk pre-processing request.
* **Guards** → akses kontrol sebelum masuk controller.
* **Interceptors** → pre/post request modification, transform response, logging, caching.
* **Pipes** → optional, digunakan untuk **validasi & transformasi data** sebelum masuk controller.

> NestJS mirip seperti **onion layer**: request masuk → melewati lapisan-lapisan → controller/service → response keluar.

---

Kalau mau, aku bisa buatkan **diagram alur request lengkap dengan middleware, guard, interceptor, pipe, service, dan DB** supaya lebih visual dan gampang dipahami.

Apakah mau aku buatkan diagram lengkapnya?
