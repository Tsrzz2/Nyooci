import { Link } from 'react-router-dom'

const WHATSAPP_NUMBER = '62882007476292'

const branches = [
  {
    city: 'Kota Semarang',
    name: 'Cabang Kota Semarang',
    address: 'Jl. Wanamukti, Sambiroto, Kec. Tembalang, Kota Semarang, Jawa Tengah 50276',
    phone: '0812-3456-7890',
    hours: 'Senin – Minggu, 09.00 – 21.00 WIB',
    coverage: 'Kota Semarang, Jawa Tengah, Sambiroto, Tembalang',
    mapUrl: 'https://maps.app.goo.gl/BPQwzdJ5kbAnzpXT7',
    isMain: true
  },
  {
    city: 'Bandung',
    name: 'Cabang Bandung',
    address: 'Jl. Braga No. 45, Braga, Kec. Sumur Bandung, Bandung 40111',
    phone: '0823-4567-8901',
    hours: 'Senin – Sabtu, 09.00 – 20.00 WIB',
    coverage: 'Bandung Kota, Cimahi, Lembang, Padalarang',
    mapUrl: 'https://maps.google.com/?q=Jl.+Braga+No.+45+Bandung',
    isMain: false
  },
  {
    city: 'Surabaya',
    name: 'Cabang Surabaya',
    address: 'Jl. Tunjungan No. 67, Genteng, Kec. Genteng, Surabaya 60275',
    phone: '0834-5678-9012',
    hours: 'Senin – Minggu, 09.00 – 21.00 WIB',
    coverage: 'Surabaya Pusat, Gubeng, Wonokromo, Sidoarjo',
    mapUrl: 'https://maps.google.com/?q=Jl.+Tunjungan+No.+67+Surabaya',
    isMain: false
  }
]

const pickupInfo = [
  {
    icon: '🚚',
    title: 'Gratis Antar Jemput',
    desc: 'Untuk pesanan minimal Rp 100.000 di area jangkauan cabang terdekat.'
  },
  {
    icon: '📅',
    title: 'Jadwal Fleksibel',
    desc: 'Tentukan waktu pickup saat booking online — pagi, siang, atau sore.'
  },
  {
    icon: '📍',
    title: 'Tracking Real-time',
    desc: 'Dapatkan update status sepatu via WhatsApp dari jemput hingga selesai.'
  }
]

export default function Lokasi() {
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
            TERSEDIA DI 3 KOTA
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1.5rem' }}>
            Lokasi Nyooci
          </h1>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', opacity: 0.95 }}>
            Kunjungi cabang terdekat atau gunakan layanan antar jemput gratis.
            Kami melayani pelanggan di Jakarta, Bandung, dan Surabaya.
          </p>
        </div>
      </section>

      {/* Cabang */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
            Cabang Kami
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '3rem', maxWidth: '600px', marginInline: 'auto' }}>
            Tiga cabang siap melayani perawatan sepatu premium Anda dengan standar kualitas yang sama.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {branches.map((branch) => (
              <div
                key={branch.city}
                style={{
                  background: 'var(--light)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                  border: branch.isMain ? '2px solid var(--primary)' : 'none'
                }}
              >
                <div style={{
                  background: branch.isMain
                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                    : 'linear-gradient(135deg, var(--secondary) 0%, #c93d55 100%)',
                  color: 'white',
                  padding: '1.5rem 2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>📍 {branch.name}</h3>
                    {branch.isMain && (
                      <span style={{
                        background: 'rgba(255,255,255,0.25)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        Pusat
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '2rem' }}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                      Alamat
                    </p>
                    <p style={{ color: 'var(--dark)', lineHeight: '1.7' }}>{branch.address}</p>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                      Telepon
                    </p>
                    <a href={`tel:${branch.phone.replace(/-/g, '')}`} style={{ color: 'var(--secondary)', fontWeight: '600' }}>
                      {branch.phone}
                    </a>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                      Jam Operasional
                    </p>
                    <p style={{ color: 'var(--gray)' }}>{branch.hours}</p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                      Area Jangkauan Antar Jemput
                    </p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9375rem', lineHeight: '1.7' }}>{branch.coverage}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      Buka di Maps
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Nyooci%20${branch.city}!%20Saya%20ingin%20booking%20layanan%20cuci%20sepatu.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{ background: '#25D366', color: 'white' }}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Antar Jemput */}
      <section style={{ padding: '5rem 2rem', background: 'var(--light)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
            Layanan Antar Jemput
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '3rem', maxWidth: '650px', marginInline: 'auto', lineHeight: '1.8' }}>
            Tidak sempat ke cabang? Tim Nyooci siap menjemput sepatu Anda di rumah, kantor, atau kampus —
            lalu mengantarkannya kembali setelah perawatan selesai.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {pickupInfo.map((item) => (
              <div key={item.title} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.9375rem', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--primary)' }}>
            Hubungi Kami
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--light)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>WhatsApp</h3>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} style={{ color: 'var(--primary)', fontWeight: '600' }}>
                +62 882-0074-76292
              </a>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--light)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
              <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>Email</h3>
              <a href="mailto:hello@nyooci.com" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                hello@nyooci.com
              </a>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--light)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</div>
              <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>Booking Online</h3>
              <Link to="/services" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                Pesan Sekarang →
              </Link>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, var(--secondary) 0%, var(--warning) 100%)',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
              Butuh Bantuan Memilih Cabang?
            </h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.95, lineHeight: '1.8' }}>
              Hubungi tim kami via WhatsApp — kami bantu tentukan cabang terdekat dan jadwal pickup yang paling nyaman untuk Anda.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Nyooci!%20Saya%20ingin%20tanya%20lokasi%20cabang%20terdekat.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ padding: '0.875rem 2rem', background: 'white', color: 'var(--dark)', fontWeight: '700' }}
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
