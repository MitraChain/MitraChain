use cardano/transaction.{Transaction, OutputReference}
use aiken/builtin

// Struktur data transaksi yang kita log
type PurchaseDatum {
  order_id: ByteArray,      // hash unik dari order
  customer: ByteArray,      // bisa pakai hash dari wallet/email
  amount: Int,              // nominal transaksi (misal dalam Lovelace atau cent)
  timestamp: Int            // unix timestamp
}

// Validator untuk log transaksi
validator log_transaksi {
  // Hanya ada `spend` karena kita cuma nyimpen data immutable
  spend(datum: Option<Data>, _redeemer: Data, _utxo: OutputReference, _self: Transaction) -> Bool {
    when datum is {
      Some(d) -> {
        expect parsed: PurchaseDatum = d
        let PurchaseDatum { order_id, customer, amount, timestamp } = parsed
        
        // Validasi
        and {
          amount > 0,
          builtin.length_of_bytearray(order_id) > 0,
          builtin.length_of_bytearray(customer) > 0,
          timestamp > 0
        }
      }
      None -> False
    }
  }
}