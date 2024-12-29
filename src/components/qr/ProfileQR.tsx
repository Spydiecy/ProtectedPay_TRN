import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ProfileQRProps {
  username: string;
  address: string;
  onClose?: () => void;
}

const ProfileQR: React.FC<ProfileQRProps> = ({ username, address, onClose }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const qrData = JSON.stringify({
    app: "ProtectedPay",
    username,
    address,
    type: "payment"
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pay ${username} on ProtectedPay`,
          text: `Send payment to ${username} using ProtectedPay`,
          url: `https://protectedpay.com/transfer?to=${address}`
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `protectedpay-${username}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-stretch md:gap-8">
      {/* Left side - QR Code */}
      <div className="flex-1 flex flex-col items-center md:justify-center md:min-w-[300px] sm:min-w-[200px]">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <motion.div
            className="relative p-4 sm:p-2 rounded-2xl bg-black/60 border border-green-500/30 shadow-lg"
            ref={qrRef}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <QRCodeSVG
              value={qrData}
              size={isMobile ? 200 : 300}
              level="H"
              includeMargin={true}
              bgColor="#111111"
              fgColor="#10B981"
              imageSettings={{
                src: "/logo.png",
                x: undefined,
                y: undefined,
                height: isMobile ? 30 : 45,
                width: isMobile ? 30 : 45,
                excavate: true,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 flex flex-col justify-center mt-4 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 mb-4"
        >
            <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text text-center md:text-left">
            Payment QR
            </h3>
            <div className="flex flex-col gap-1 items-center md:items-start">
            <p className="text-md md:text-xl text-green-400 font-semibold">{username}</p>
            <p className="text-xs md:text-sm text-gray-400">Scan to send payment</p>
            </div>
        </motion.div>

        <div className="space-y-4">
          <div className="flex justify-center md:justify-start gap-4">
            {typeof navigator.share === 'function' && (
              <motion.button
                onClick={handleShare}
                className="p-3 bg-black/80 rounded-xl border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShareIcon className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            )}

            <motion.button
              onClick={handleDownload}
              className="p-3 bg-black/80 rounded-xl border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowDownTrayIcon className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </div>

          <div className="px-3 py-2 bg-black/40 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-400 break-all text-center md:text-left">{address}</p>
          </div>

          {onClose && (
            <motion.button
              onClick={onClose}
              className="w-full px-6 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-xl hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 shadow-lg text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileQR;