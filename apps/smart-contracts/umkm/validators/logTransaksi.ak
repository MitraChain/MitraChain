use cardano/transaction.{Transaction, OutputReference}
use aiken/list
use aiken/string
use aiken/bytearray

//SC UNTUK MENYIMPAN DATA TRANSAKSI KE CHAIN
// Struktur data transaksi yang kita log
type PurchaseDatum {
  order_id: ByteArray,      // hash unik dari order
  customer: ByteArray,      // bisa pakai hash dari wallet/email
  amount: Int,              // nominal transaksi (misal dalam Lovelace atau cent)
  timestamp: Int            // unix timestamp
}

// Validator untuk log transaksi
validator LogTransaksi {
  // Hanya ada `spend` karena kita cuma nyimpen data immutable
  spend(datum: Option<Data>, _redeemer: Data, _utxo: OutputReference, self: Transaction) -> Bool {
    // Pastikan ada datum
    when datum is {
      Some(d) ->
        let parsed: PurchaseDatum = from_data(d)

        // Validasi amount > 0 && order_id != kosong
        parsed.amount > 0 && list.length(parsed.order_id) > 0

      None -> False
    }
  }
}

