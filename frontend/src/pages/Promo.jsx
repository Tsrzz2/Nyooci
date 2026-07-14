export default function Promo() {
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>Promo Spesial</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #5dbbe3 0%, #97c05c 100%)', padding: '2rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Diskon 20%</h3>
            <p style={{ marginBottom: '1rem' }}>Untuk layanan Deep Cleaning</p>
            <p style={{ fontWeight: 'bold' }}>Berlaku sampai 31 Juli 2026</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #e34c67 0%, #f9d423 100%)', padding: '2rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>👥 Cuci 1 Gratis 1</h3>
            <p style={{ marginBottom: '1rem' }}>Untuk layanan Premium Cleaning</p>
            <p style={{ fontWeight: 'bold' }}>Berlaku sampai 31 Juli 2026</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #97c05c 0%, #5dbbe3 100%)', padding: '2rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚚 Gratis Antar Jemput</h3>
            <p style={{ marginBottom: '1rem' }}>Untuk pesanan minimal Rp 100.000</p>
            <p style={{ fontWeight: 'bold' }}>Berlaku selamanya!</p>
          </div>
        </div>
    </div>
  )
}