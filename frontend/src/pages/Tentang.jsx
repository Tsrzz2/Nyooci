import { Link } from 'react-router-dom'

const WHATSAPP_NUMBER = '62882007476292'

const values = [
  {
    icon: '✨',
    title: 'Kualitas Premium',
    desc: 'Menggunakan bahan pembersih dan perawatan berkualitas tinggi yang aman untuk berbagai jenis material sepatu — kulit, suede, canvas, dan mesh.'
  },
  {
    icon: '🛡️',
    title: 'Bergaransi',
    desc: 'Setiap layanan kami dijamin hasilnya. Sepatu Anda ditangani dengan standar profesional agar bersih, awet, dan nyaman dipakai kembali.'
  },
  {
    icon: '🚚',
    title: 'Antar Jemput',
    desc: 'Tidak perlu repot ke tempat kami. Nikmati layanan antar jemput gratis untuk pesanan minimal Rp 100.000 di area layanan kami.'
  },
  {
    icon: '⏰',
    title: 'Cepat & Tepat Waktu',
    desc: 'Proses perawatan efisien dengan estimasi waktu yang jelas. Sepatu Anda kembali bersih sesuai jadwal yang disepakati.'
  },
  {
    icon: '👟',
    title: 'Semua Jenis Sepatu',
    desc: 'Dari sneakers harian, sepatu formal, hingga sepatu olahraga — kami tangani semua jenis sepatu dengan metode perawatan yang tepat.'
  },
  {
    icon: '💬',
    title: 'Layanan Responsif',
    desc: 'Tim kami siap membantu via WhatsApp untuk konsultasi, pemesanan, dan update status perawatan sepatu Anda.'
  }
]

const services = [
  { name: 'Cleaning', desc: 'Deep Cleaning & Premium Cleaning untuk menghilangkan noda, debu, dan bakteri.' },
  { name: 'Repair', desc: 'Perbaikan sol, jahitan, dan kerusakan pada sepatu kulit maupun sneakers.' },
  { name: 'Repaint', desc: 'Restorasi warna dan custom painting untuk sepatu yang pudar atau ingin tampil baru.' },
  { name: 'Polishing', desc: 'Poles high-shine agar sepatu kulit tampil mengkilap dan terawat.' },
  { name: 'Hydration', desc: 'Treatment moisturizing dan anti-crease untuk menjaga kelembutan kulit sepatu.' }
]

const steps = [
  { step: '1', title: 'Pilih Layanan', desc: 'Jelajahi layanan kami dan pilih treatment yang sesuai kebutuhan sepatu Anda.' },
  { step: '2', title: 'Booking Online', desc: 'Isi form booking, tentukan jadwal pickup, dan konfirmasi pesanan dengan mudah.' },
  { step: '3', title: 'Antar Jemput', desc: 'Tim kami menjemput sepatu Anda di alamat yang telah ditentukan.' },
  { step: '4', title: 'Perawatan Profesional', desc: 'Sepatu ditangani oleh tim ahli dengan produk dan teknik perawatan terbaik.' },
  { step: '5', title: 'Antar Kembali', desc: 'Sepatu bersih dan terawat dikembalikan ke tangan Anda — siap dipakai!' }
]

export default function Tentang() {
  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)',
        color: 'white',
        padding: '5rem 2rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
            PREMIUM SHOE CARE SINCE 2026
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1.5rem' }}>
            Tentang Nyooci
          </h1>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', opacity: 0.95 }}>
            Lebih dari sekadar cuci sepatu — Nyooci adalah layanan perawatan sepatu premium bergaransi
            yang berkomitmen merawat, melindungi, dan mengembalikan tampilan sepatu kesayangan Anda.
          </p>
        </div>
      </section>

      {/* Cerita Kami */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--primary)' }}>
            Siapa Kami?
          </h2>
          <p style={{ fontSize: '1.0625rem', lineHeight: '1.9', color: 'var(--text)', marginBottom: '1.25rem' }}>
            <strong>Nyooci</strong> didirikan dengan visi sederhana: setiap orang layak memiliki sepatu yang bersih,
            terawat, dan tampil percaya diri. Kami memahami bahwa sepatu bukan hanya alas kaki — sepatu adalah
            bagian dari gaya hidup, kenangan, dan investasi yang layak dirawat dengan baik.
          </p>
          <p style={{ fontSize: '1.0625rem', lineHeight: '1.9', color: 'var(--text)', marginBottom: '1.25rem' }}>
            Berawal dari kebutuhan akan layanan cuci sepatu yang benar-benar profesional, Nyooci hadir dengan
            standar premium — menggunakan produk berkualitas, teknik perawatan yang tepat, dan tim yang
            berpengalaman. Kami melayani pelanggan di <strong>Jakarta, Bandung, dan Surabaya</strong> dengan
            kemudahan booking online dan layanan antar jemput.
          </p>
          <p style={{ fontSize: '1.0625rem', lineHeight: '1.9', color: 'var(--text)' }}>
            Saat ini, Nyooci menawarkan lima kategori layanan utama — dari pembersihan mendalam, perbaikan,
            repaint, polishing, hingga hydration — sehingga sepatu Anda mendapat perawatan lengkap dalam satu tempat.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section style={{ padding: '5rem 2rem', background: 'var(--light)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>🎯 Visi</h3>
              <p style={{ lineHeight: '1.8', color: 'var(--gray)' }}>
                Menjadi layanan perawatan sepatu premium terpercaya di Indonesia yang memberikan
                pengalaman terbaik bagi setiap pelanggan — dari kualitas hasil hingga kemudahan layanan.
              </p>
            </div>
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>🚀 Misi</h3>
              <ul style={{ lineHeight: '1.9', color: 'var(--gray)', paddingLeft: '1.25rem' }}>
                <li>Memberikan perawatan sepatu berkualitas premium dengan harga terjangkau</li>
                <li>Menggunakan produk aman dan teknik yang tepat untuk setiap jenis sepatu</li>
                <li>Menyediakan layanan antar jemput dan booking online yang praktis</li>
                <li>Membangun kepercayaan pelanggan melalui hasil yang konsisten dan bergaransi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-nilai */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>
            Mengapa Memilih Nyooci?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {values.map((v) => (
              <div key={v.title} style={{ textAlign: 'center', padding: '2rem', background: 'var(--light)', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1.125rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.9375rem', lineHeight: '1.7' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section style={{ padding: '5rem 2rem', background: 'var(--light)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
            Layanan yang Kami Tawarkan
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '3rem', maxWidth: '600px', marginInline: 'auto' }}>
            Perawatan lengkap untuk semua kebutuhan sepatu Anda — dari bersih-bersih hingga restorasi penuh.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {services.map((s) => (
              <div key={s.name} style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ color: 'var(--dark)', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '1px' }}>
                  {s.name}
                </h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.9375rem', lineHeight: '1.7' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>
            Cara Kerja
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {steps.map((s) => (
              <div key={s.step} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '1.25rem', margin: '0 auto 1rem'
                }}>
                  {s.step}
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', lineHeight: '1.7' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, var(--secondary) 0%, var(--warning) 100%)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
            Siap Merawat Sepatu Kesayangan Anda?
          </h2>
          <p style={{ marginBottom: '2rem', opacity: 0.95, lineHeight: '1.8' }}>
            Booking sekarang dan nikmati promo spesial — diskon 20% Deep Cleaning,
            Beli 1 Gratis 1 Premium Cleaning, dan gratis antar jemput untuk pesanan minimal Rp 100.000.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn" style={{ padding: '0.875rem 2rem', background: 'white', color: 'var(--dark)', fontWeight: '700' }}>
              Booking Sekarang
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Nyooci!%20Saya%20ingin%20bertanya%20tentang%20layanan%20cuci%20sepatu.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ padding: '0.875rem 2rem', background: '#25D366', color: 'white', fontWeight: '700' }}
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
