export const handleOpenWhastApp = (rideData, currentUser) => {
  let url = "";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    const isWhatsAppInstalled = /WhatsApp/i.test(navigator.userAgent);
    if (isWhatsAppInstalled) {
      url = `whatsapp://send?text=Hey%20${
        rideData?.driverData.username
      },%20it's%20${
        currentUser?.username
      },%20from%20Yooke!&phone=+233${rideData?.driverData?.whatsappNumber.slice(
        -9
      )}`;
    } else {
      const platform = /(android)/i.test(navigator.userAgent)
        ? "android"
        : "ios";
      url = `https://wa.me/?text=Hey%20${
        rideData?.driverData.username
      },%20it's%20${
        currentUser?.username
      },%20from%20Yooke!&phone=+233${rideData?.driverData?.whatsappNumber.slice(
        -9
      )}&app_absent=1${platform === "android" ? "&fallback_url=" : ""}${
        platform === "android"
          ? "market://details?id=com.whatsapp"
          : "https://apps.apple.com/app/id310633997"
      }`;
    }
  } else {
    url = `https://web.whatsapp.com/send?phone=+233${rideData?.driverData?.whatsappNumber.slice(
      -9
    )}&text=Hey%20${rideData?.driverData.username},%20it's%20${
      currentUser?.username
    },%20from%20Yooke!&phone=+233${rideData?.driverData?.whatsappNumber.slice(
      -9
    )}`;
  }
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    const appUrl = url;
    // const webUrl = webUrl;
    const appWindow = window.open(appUrl, "_blank");
    setTimeout(() => {
      if (!appWindow || appWindow.closed || appWindow.closed === undefined) {
        window.location.href = appUrl;
      }
    }, 500);
  } else {
    window.open(webUrl, "_blank");
  }
};
