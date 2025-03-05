'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRightIcon, 
  ArrowDownIcon,
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { useWallet } from '@/context/WalletContext'
import { 
  sendToAddress,
  sendToUsername,
  claimTransferByAddress,
  claimTransferByUsername,
  claimTransferById,
  refundTransfer,
  getPendingTransfers,
  getTransferDetails
} from '@/utils/contract'
import { useChainInfo } from '@/utils/useChainInfo';
import QRScanner from '@/components/qr/QRScanner';

enum TransferTabs {
  SEND = 'send',
  CLAIM = 'claim',
  REFUND = 'refund'
}

interface Transfer {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  timestamp: number;
  remarks: string;
  status: number;
}

const pageTransition = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3 } 
  }
}

export default function TransferPage() {
  const [activeTab, setActiveTab] = useState<TransferTabs>(TransferTabs.SEND)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [remarks, setRemarks] = useState('')
  const [transferId, setTransferId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([])
  const [pendingSentTransfers, setPendingSentTransfers] = useState<Transfer[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { signer, address } = useWallet()
  const { currentChain } = useChainInfo();

  const fetchPendingTransfers = useCallback(async () => {
    if (!signer || !address) return

    try {
      setIsLoading(true)
      // Get all pending transfer IDs for the connected wallet
      const transferIds = await getPendingTransfers(signer, address)
      
      console.log('Fetched transfer IDs:', transferIds)
      
      if (!transferIds || transferIds.length === 0) {
        setPendingTransfers([])
        setPendingSentTransfers([])
        setIsLoading(false)
        return
      }

      // For each transfer ID, get the full details and parse them
      const transfers = await Promise.all(
        transferIds.map(async (id: string) => {
          try {
            const details = await getTransferDetails(signer, id)
            console.log(`Transfer details for ${id}:`, details)
            
            // Format the details into our Transfer interface format
            return {
              id,
              sender: details.sender || '',
              recipient: details.recipient || '',
              amount: details.amount ? details.amount.toString() : '0',
              timestamp: details.timestamp ? 
                (typeof details.timestamp === 'number' ? details.timestamp : 
                 details.timestamp.toNumber ? details.timestamp.toNumber() : 
                 details.timestamp.getTime ? details.timestamp.getTime() : 0) : 0,
              remarks: details.remarks || '',
              status: details.status !== undefined ? 
                (typeof details.status === 'number' ? details.status : 
                 details.status.toNumber ? details.status.toNumber() : 0) : 0
            } as Transfer
          } catch (err) {
            console.error(`Error fetching details for transfer ${id}:`, err)
            return null
          }
        })
      )
      
      // Filter out any failed transfers and split into received vs sent transfers
      const validTransfers = transfers.filter(t => t !== null) as Transfer[]
      console.log('Processed transfers:', validTransfers)
      
      // Transfers where the current address is the recipient
      const receivedTransfers = validTransfers.filter(t => 
        t.recipient.toLowerCase() === address.toLowerCase() && 
        t.status === 0 // Pending status
      )
      
      // Transfers where the current address is the sender
      const sentTransfers = validTransfers.filter(t => 
        t.sender.toLowerCase() === address.toLowerCase() && 
        t.status === 0 // Pending status
      )
      
      setPendingTransfers(receivedTransfers)
      setPendingSentTransfers(sentTransfers)
      
    } catch (err) {
      console.error('Error fetching transfers:', err)
    } finally {
      setIsLoading(false)
    }
  }, [signer, address])

  useEffect(() => {
    if (signer && address) {
      fetchPendingTransfers()
    }
  }, [fetchPendingTransfers, signer, address])

  const handleTabChange = (tab: TransferTabs) => {
    setActiveTab(tab)
    resetForm()
  }

  const resetForm = () => {
    setRecipient('')
    setAmount('')
    setRemarks('')
    setTransferId('')
    setError('')
    setSuccess('')
  }

  const validateSendForm = (): string | null => {
    if (!recipient) return 'Recipient is required'
    if (!amount || parseFloat(amount) <= 0) return 'Valid amount is required'
    if (!remarks) return 'Please add a remark for the transfer'
    if (parseFloat(amount) > 1000000) return 'Amount exceeds maximum limit'
    return null
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signer || !address) {
      setError('Please connect your wallet first')
      return
    }

    const validationError = validateSendForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (recipient.startsWith('0x')) {
        await sendToAddress(signer, recipient, amount, remarks)
      } else {
        await sendToUsername(signer, recipient, amount, remarks)
      }
      
      setSuccess('Transfer initiated successfully!')
      resetForm()
      // Let's wait a bit before fetching to ensure transaction is indexed
      setTimeout(() => fetchPendingTransfers(), 2000)
    } catch (error) {
      console.error('Transfer error:', error)
      setError(error instanceof Error ? error.message : 'Failed to initiate transfer')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async (id: string) => {
    if (!signer) {
      setError('Please connect your wallet first')
      return
    }
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (id.startsWith('0x') && id.length === 66) {
        await claimTransferById(signer, id)
      } else if (id.startsWith('0x')) {
        await claimTransferByAddress(signer, id)
      } else {
        await claimTransferByUsername(signer, id)
      }
      setSuccess('Transfer claimed successfully!')
      resetForm()
      setTimeout(() => fetchPendingTransfers(), 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to claim transfer')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async (id: string) => {
    if (!signer) {
      setError('Please connect your wallet first')
      return
    }
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await refundTransfer(signer, id)
      setSuccess('Transfer refunded successfully!')
      resetForm()
      setTimeout(() => fetchPendingTransfers(), 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to refund transfer')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedId(text)
        setTimeout(() => setCopiedId(null), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }

  // Helper to truncate long addresses/ids
  const truncateText = (text: string, startChars = 6, endChars = 4) => {
    if (!text) return '';
    if (text.length <= startChars + endChars) return text;
    return `${text.substring(0, startChars)}...${text.substring(text.length - endChars)}`;
  }

  const formatAmount = (amount: string) => {
    if (!amount) return '0';
    // Try to parse the amount and format it to a maximum of 6 decimal places
    try {
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) return amount;
      
      // If it's a whole number, show no decimals
      if (parsed % 1 === 0) return parsed.toString();
      
      // Otherwise show up to 6 decimal places
      return parsed.toFixed(6).replace(/\.?0+$/, '');
    } catch (e) {
      return amount;
    }
  }

  const renderForm = () => {
    switch (activeTab) {
      case TransferTabs.SEND:
        return (
          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="mb-2 text-green-400 font-medium">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-green-500/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                placeholder="0x... or username"
                required
              />
            </div>

            <div>
              <label className="mb-2 text-green-400 font-medium">Amount ({currentChain.symbol})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-green-500/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                placeholder="0.0"
                required
                min="0"
                step="0.000000000000000001"
              />
            </div>

            <div>
              <label className="mb-2 text-green-400 font-medium flex items-center space-x-2">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                <span>Remarks</span>
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-green-500/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                placeholder="Add a note about this transfer"
                required
                rows={3}
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-black px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:brightness-110 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !signer}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ArrowRightIcon className="w-5 h-5" />
                  <span>Transfer</span>
                </>
              )}
            </motion.button>
          </form>
        );

      case TransferTabs.CLAIM:
      case TransferTabs.REFUND:
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (activeTab === TransferTabs.CLAIM) {
              handleClaim(transferId);
            } else {
              handleRefund(transferId);
            }
          }} className="space-y-6">
            <div>
              <label className="mb-2 text-green-400 font-medium">
                {activeTab === TransferTabs.CLAIM ? 'Sender Identifier' : 'Transfer ID'}
              </label>
              <input
                type="text"
                value={transferId}
                onChange={(e) => setTransferId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-green-500/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                placeholder={activeTab === TransferTabs.CLAIM ? "Address, username, or transfer ID" : "Transfer ID"}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-black px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:brightness-110 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !signer}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {activeTab === TransferTabs.CLAIM ? (
                    <ArrowDownIcon className="w-5 h-5" />
                  ) : (
                    <ArrowLeftIcon className="w-5 h-5" />
                  )}
                  <span>{activeTab === TransferTabs.CLAIM ? 'Claim' : 'Refund'}</span>
                </>
              )}
            </motion.button>
          </form>
        );

      default:
        return null;
    }
  };

  const renderTransferList = () => {
    // Select which transfers to display based on the active tab
    const transfers = activeTab === TransferTabs.CLAIM ? pendingTransfers :
                      activeTab === TransferTabs.REFUND ? pendingSentTransfers :
                      [...pendingTransfers, ...pendingSentTransfers];

    if (!signer) {
      return (
        <div className="text-center py-8 text-gray-400">
          Connect wallet to view transfers
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-8 flex flex-col items-center justify-center">
          <ArrowPathIcon className="w-8 h-8 text-green-400 animate-spin mb-4" />
          <p className="text-gray-400">Loading transfers...</p>
        </div>
      );
    }

    if (transfers.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          No pending transfers found
        </div>
      );
    }

    return (
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 styled-scrollbar">
        {transfers.map((transfer) => (
          <motion.div
            key={transfer.id}
            className="relative group"
            variants={fadeIn}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-black/30 backdrop-blur-xl p-4 rounded-xl border border-green-500/10 group-hover:border-green-500/20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    {activeTab === TransferTabs.CLAIM || 
                     (activeTab === TransferTabs.SEND && transfer.sender.toLowerCase() !== address?.toLowerCase()) ? 
                      `From: ${truncateText(transfer.sender)}` : 
                      `To: ${truncateText(transfer.recipient)}`}
                  </div>
                  <div className="text-green-400 font-semibold">{formatAmount(transfer.amount)} {currentChain.symbol}</div>
                </div>
                <motion.button
                  onClick={() => {
                    if (activeTab === TransferTabs.CLAIM || 
                        (activeTab === TransferTabs.SEND && transfer.recipient.toLowerCase() === address?.toLowerCase())) {
                      handleClaim(transfer.id);
                    } else {
                      handleRefund(transfer.id);
                    }
                  }}
                  className={`${
                    (activeTab === TransferTabs.CLAIM || 
                     (activeTab === TransferTabs.SEND && transfer.recipient.toLowerCase() === address?.toLowerCase()))
                      ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                      : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                  } border px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {(activeTab === TransferTabs.CLAIM || 
                    (activeTab === TransferTabs.SEND && transfer.recipient.toLowerCase() === address?.toLowerCase())) ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Claim</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4" />
                      <span>Refund</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Transfer ID with copy button */}
              <div className="flex items-center space-x-2 mb-2 bg-black/40 p-2 rounded-lg">
                <div className="text-xs text-gray-400 overflow-hidden text-ellipsis">
                  ID: {truncateText(transfer.id, 8, 8)}
                </div>
                <motion.button
                  onClick={() => copyToClipboard(transfer.id)}
                  className="bg-black/30 p-1 rounded text-green-400 hover:text-green-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy Transfer ID"
                >
                  {copiedId === transfer.id ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => {
                    setTransferId(transfer.id);
                    if (transfer.sender.toLowerCase() === address?.toLowerCase()) {
                      setActiveTab(TransferTabs.REFUND);
                    } else {
                      setActiveTab(TransferTabs.CLAIM);
                    }
                  }}
                  className="text-xs bg-green-500/10 px-2 py-0.5 rounded text-green-400 hover:bg-green-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Use
                </motion.button>
              </div>

              {transfer.remarks && (
                <div className="bg-black/20 p-2 rounded-lg text-sm text-gray-400 mb-2">
                  {transfer.remarks}
                </div>
              )}
              <div className="text-xs text-gray-500 flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>{new Date(transfer.timestamp * 1000).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-green-950">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />
      
      <motion.div 
        className="container mx-auto px-4 py-20 relative z-10"
        initial="initial"
        animate="animate"
        variants={pageTransition}
      >
        {/* Header */}
        <motion.div className="text-center mb-12">
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(16, 185, 129, 0.2)",
                "0 0 60px rgba(16, 185, 129, 0.4)",
                "0 0 20px rgba(16, 185, 129, 0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-black/30 p-6 rounded-2xl backdrop-blur-xl border border-green-500/10">
              {activeTab === TransferTabs.SEND && <ArrowRightIcon className="w-16 h-16 text-green-400" />}
              {activeTab === TransferTabs.CLAIM && <ArrowDownIcon className="w-16 h-16 text-green-400" />}
              {activeTab === TransferTabs.REFUND && <ArrowLeftIcon className="w-16 h-16 text-green-400" />}
            </div>
          </motion.div>

          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              {activeTab === TransferTabs.SEND ? 'Transfer Funds' : 
               activeTab === TransferTabs.CLAIM ? 'Claim Funds' : 
               'Refund Transfer'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {activeTab === TransferTabs.SEND ? 'Send funds securely to any address or username' :
             activeTab === TransferTabs.CLAIM ? 'Claim your incoming transfers easily' :
             'Recover funds from unclaimed transfers'}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex rounded-xl overflow-hidden bg-black/30 backdrop-blur-xl border border-green-500/20 p-1">
            {Object.values(TransferTabs).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-green-500 text-black' 
                    : 'text-green-400 hover:bg-green-500/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Panel - Form */}
            <motion.div variants={pageTransition}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl" />
                <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20">
                  {renderForm()}
                </div>
              </div>
            </motion.div>

            {/* Right Panel - List */}
            <motion.div variants={pageTransition}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl" />
                <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-green-400 flex items-center space-x-2">
                      <ClockIcon className="w-5 h-5" />
                      <span>
                        {activeTab === TransferTabs.SEND ? 'Recent Transfers' :
                         activeTab === TransferTabs.CLAIM ? 'Pending Claims' :
                         'Pending Refunds'}
                      </span>
                    </h2>
                    <motion.button
                      onClick={fetchPendingTransfers}
                      className="bg-black/30 p-2 rounded-lg text-green-400 hover:text-green-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {renderTransferList()}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {(success || error) && (
              <motion.div
                className="fixed bottom-8 right-8 max-w-md z-50"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`p-4 rounded-xl backdrop-blur-xl border ${
                    success
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {success ? (
                      <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p>{success || error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-black/80 p-6 rounded-2xl border border-green-500/20 flex flex-col items-center space-y-4">
                  <ArrowPathIcon className="w-8 h-8 text-green-400 animate-spin" />
                  <p className="text-green-400 font-medium">Processing Transaction...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* QR Scanner */}
      <QRScanner 
        onScan={(data) => {
          setRecipient(data);
          setActiveTab(TransferTabs.SEND);
        }}
        onError={(error) => setError(error)}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 3px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
}
