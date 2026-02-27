import { CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionTable = ({ transactions, isAdmin, onApprove, onReject }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {isAdmin && (
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
            )}
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Symbol</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Type</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Price</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
            <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
            {isAdmin && <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {isAdmin && (
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {transaction.user?.name || 'Unknown'}
                </td>
              )}
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.name}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`flex items-center text-sm font-medium ${
                  transaction.type === 'buy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'buy' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {transaction.type.toUpperCase()}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-sm text-gray-900 dark:text-white">
                {transaction.quantity}
              </td>
              <td className="py-3 px-4 text-right text-sm text-gray-900 dark:text-white">
                ${transaction.price.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                ${transaction.totalAmount.toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </td>
              {isAdmin && (
                <td className="py-3 px-4">
                  {transaction.status === 'pending' && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onApprove(transaction._id)}
                        className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onReject(transaction._id)}
                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {transactions.length === 0 && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          No transactions found
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
