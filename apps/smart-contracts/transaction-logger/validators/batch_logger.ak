// validators/batch_logger.ak
use cardano/transaction.{OutputReference, Transaction}

// === TYPES ===

pub type TransactionRecord {
  tx_id: ByteArray,
  amount: Int,
  timestamp: Int,
  customer_wallet: ByteArray,
}

pub type BatchDatum {
  business_id: ByteArray,
  batch_number: Int,
  transactions: List<TransactionRecord>,
  merkle_root: ByteArray,
  total_amount: Int,
  recorded_at: Int,
}

pub type BatchRedeemer {
  RecordBatch
  VerifyBatch
}

// === VALIDATOR ===

validator batch_logger {
  spend(
    datum: Option<BatchDatum>,
    redeemer: BatchRedeemer,
    _output_ref: OutputReference,
    _self: Transaction,
  ) {
    when datum is {
      Some(batch_datum) -> {
        when redeemer is {
          RecordBatch -> {
            // 1. Validate exactly 10 transactions
            expect length(batch_datum.transactions) == 10
            
            // 2. Validate total amount matches sum
            let calculated_total = sum_amounts(batch_datum.transactions)
            expect batch_datum.total_amount == calculated_total
            
            // 3. Validate all amounts are positive
            expect all_positive(batch_datum.transactions)
            
            // 4. Validate merkle root is not empty
            expect batch_datum.merkle_root != ""
            
            // 5. Validate business_id not empty
            expect batch_datum.business_id != ""
            
            True
          }
          
          VerifyBatch -> {
            // Verification by auditor
            True
          }
        }
      }
      None -> False
    }
  }
}

// === HELPERS ===

// Get list length
fn length(list: List<a>) -> Int {
  when list is {
    [] -> 0
    [_head, ..tail] -> 1 + length(tail)
  }
}

// Sum all transaction amounts
fn sum_amounts(transactions: List<TransactionRecord>) -> Int {
  when transactions is {
    [] -> 0
    [tx, ..rest] -> tx.amount + sum_amounts(rest)
  }
}

// Check all amounts are positive
fn all_positive(transactions: List<TransactionRecord>) -> Bool {
  when transactions is {
    [] -> True
    [tx, ..rest] -> {
      if tx.amount > 0 {
        all_positive(rest)
      } else {
        False
      }
    }
  }
}