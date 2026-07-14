require('dotenv').config();
const fetch = require('node-fetch');

async function testSheetDB() {
  console.log('Testing SheetDB dengan URL:', process.env.SHEETDB_URL);

  if (!process.env.SHEETDB_URL) {
    console.log('❌ SHEETDB_URL tidak ada di .env!');
    return;
  }

  const testBooking = {
    _id: 'TEST-001',
    service: { name: 'Cuci Sepatu Basic' },
    totalPrice: 25000,
    createdAt: new Date(),
    status: 'pending',
    shoeType: 'Sneakers',
    pickupAddress: 'Jl. Test No.123',
    pickupDate: '2026-07-10'
  };

  const testUser = { name: 'Test User' };

  try {
    // Format 1: { data: [ { ... } ] } (array)
    const sheetData = {
      data: [
        {
          'ID Booking': testBooking._id,
          'Nama Pelanggan': testUser?.name || 'Tidak Diketahui',
          'Layanan': testBooking.service?.name || testBooking.service,
          'Harga': testBooking.totalPrice,
          'Tanggal Booking': new Date(testBooking.createdAt).toLocaleDateString('id-ID'),
          'Status': testBooking.status,
          'Jenis Sepatu': testBooking.shoeType || '-',
          'Alamat Pickup': testBooking.pickupAddress || '-',
          'Tanggal Pickup': testBooking.pickupDate || '-'
        }
      ]
    };

    console.log('📤 Mengirim data ke SheetDB:', JSON.stringify(sheetData, null, 2));

    const response = await fetch(process.env.SHEETDB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sheetData)
    });

    console.log('📥 Status response:', response.status);
    const result = await response.json();
    console.log('📥 Hasil:', result);

    if (response.ok) {
      console.log('✅ Berhasil mengirim ke SheetDB!');
    } else {
      console.log('❌ Gagal mengirim ke SheetDB!');
      
      // Coba format lain tanpa array
      console.log('🔄 Coba format tanpa array...');
      const sheetData2 = {
        data: {
          'ID Booking': testBooking._id,
          'Nama Pelanggan': testUser?.name || 'Tidak Diketahui',
          'Layanan': testBooking.service?.name || testBooking.service,
          'Harga': testBooking.totalPrice,
          'Tanggal Booking': new Date(testBooking.createdAt).toLocaleDateString('id-ID'),
          'Status': testBooking.status,
          'Jenis Sepatu': testBooking.shoeType || '-',
          'Alamat Pickup': testBooking.pickupAddress || '-',
          'Tanggal Pickup': testBooking.pickupDate || '-'
        }
      };

      const response2 = await fetch(process.env.SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetData2)
      });

      const result2 = await response2.json();
      console.log('📥 Format tanpa array result:', result2);
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testSheetDB();
