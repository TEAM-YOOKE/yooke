import React, { createContext, useState, useEffect } from "react";

// Create a new context
const LanguageContext = createContext();

// Language objects
const languages = {
  en: {
    greeting: "Hello",
    introduction: "Welcome to our website!",
    buttonText: "Change Language",
    account: "Account",
    username: "User Name",
    language: "Language",
    currentLanguage: "English",
    faq: "FAQ",
    faqDescription: "List of frequently asked questions",
    support: "Customer Service",
    supportEmail: "Send an email to support@yooke.com",
    logout: "Logout",
    accountSettings: "Account Settings",
    name: "Name",
    numberPlate: "Number Plate",
    phoneNumber: "Phone Number",
    email: "Email",
    saveChanges: "Save Changes",
    homeCarOwner: {
      home: "Home",
      acceptingRideRequests: "Accepting Ride Requests",
      usualLeavingTime: "Usual leaving time",
      stopPointsInfo:
        "Please insert stop points along your way where you can pick people up. For example, if you live in A and work at D but pass through B and C while going to work, your stop points are A, B, C, and D.",
      saveChanges: "Save Changes",
      savingChanges: "Saving Changes...",
    },
    homePassenger: {
      findARide: "Find a ride",
      pickupPoint: "Pickup Point",
      dropOffPoint: "Drop-off Point",
      selectDepartureTime: "Select Departure Time",
      searchButton: "Search",
    },
    bookingCards: {
      reserveOneSeat: "Reserve 1 seat",
      reserveTwoSeats: "Reserve 2 seats",
      reserveThreeSeats: "Reserve 3 seats",
    },
    selectLocation: {
      searchPlaceholder: "Search",
      labelPlaceholder: "Select Location",
    },
    availableRoutes: {
      topMatches: "Top Matches",
    },
    yourPath: {
      rideDetails: "Ride details",
      sendingRequest: "Sending request to share this ride...",
      sendRequest: "Send request to share this ride",
      noRouteFound: "No route found.",
      connectionRequestSent: "Request sent successfully.",
      connectionRequestError: "Failed to send request. Please try again.",
      connectionRequestExists:
        "You have already sent a connection request to this car owner.",
      departureTimeInfo:
        "The departure time above is when this car owner typically leaves. You might consider adjusting your own departure time to match theirs. Alternatively, you can contact the car owner to discuss if they are open to adjusting their departure time to better fit your schedule.",
      seatToBeReserved: "seat to be reserved",
      seatsToBeReserved: "seats to be reserved",
    },
    connectionsCarOwner: {
      title: "Connections",
      noConnectionsAlt: "No connections",
      noConnectionsMessage: "You have no connections yet.",
    },
    connectionsPassenger: {
      title: "Connections",
      noConnectionsAlt: "No connections",
      noConnectionsMessage: "You have no connections yet.",
    },
    connectionCard: {
      whatsapp: "WhatsApp",
      carImages: "Car Images",
      car: "Car",
      messageOnWhatsapp: "Message in WhatsApp",
    },
    notifications: {
      loading: "Loading...",
      noUserData: "Error: No user data",
      contactSupportOrLogin: "Please contact support or try logging in again.",
      invalidAccountType: "Error: Invalid account type",
    },
    notificationsCarOwner: {
      title: "Notifications",
      noNotificationsAlt: "No new notifications",
      noNotificationsMessage: "No new notifications",
      seats: "Seats",
      time: "Time",
      ago: "ago",
      accept: "Accept",
      reject: "Reject",
      confirmRejectionTitle: "Confirm Rejection",
      confirmRejectionMessage:
        "Are you sure you want to reject this request? This action cannot be undone and you will no longer be able to access the request later on.",
      cancel: "Cancel",
      confirm: "Confirm",
      sentYouAConnectionRequest: "sent you a connection request.",
      unknownSender: "Unknown",
    },
    notificationsPassenger: {
      title: "Notifications",
      noNotificationsAlt: "No new notifications",
      noNotificationsMessage: "No new notifications",
      seats: "Seats",
      time: "Time",
      ago: "ago",
      acceptedYourRequest: "accepted your connection request.",
      unknownSender: "Unknown",
    },
    notificationsLegacy: {
      title: "Notifications",
      acceptedRequest: "accepted your connection request.",
      sentRequest: "sent you a connection request.",
    },
    faqs: {
      title: "FAQs",
      question1:
        "How do I make it easy for others to find and connect with me as a car owner?",
      answer1:
        "In your home page, make sure to add all your stop points in the stop points field and save.",
      question2: "How do I find a ride to share?",
      answer2:
        "Use your home page to search making use of the filters we made available.",
      question3: "How do I communicate with my match?",
      answer3:
        "You can use the message in WhatsApp button or manually add their contact in your phone and message them in WhatsApp.",
      question4: "What happens after I connect?",
      answer4:
        "Your connections are available in the connections tab. You can message them to arrange on where to meet while commuting.",
    },
    settings: {
      uploadCarImages: "Upload Car Images",
      preview: "Preview",
      updateError: "Failed to update user data. Please try again.",
      phoneNumberHelper: "Please enter your number in the format: 15551234567",
    },
    appLayout: {
      home: "Home",
      connections: "Connections",
      notifications: "Notifications",
      account: "Account",
      newConnectionRequest:
        "Congratulations! You have a new connection request",
      acceptedRequest: "Congratulations! You have an accepted request",
    },
    languageSettings: "Language",
    english: "English",
    french: "Français",
    greeting: "Hello",
    landingPage: {
      language: "Language",
      login: "Login",
      pilotPhase: "Pilot phase",
      beOneOfTheFirst: "Be one of the first",
      secureCarpooling: "Secure Carpooling for Professional Women",
      streamlineCommute:
        "Designed to protect professional women from assault and harassment in public transportation",
      joinWaitingList: "Join waiting list",
      putInObjectsCalled: "put in objects called",
      landingPage: "landing page",
      joinWaitingListButton: "Join waiting list",
      partnerCompanies: "Partner companies",
      partnerCompaniesBody:
        "Exclusively reserved for professionals from partner companies",
      friendliness: "Friendliness",
      friendlinessBody:
        "Share the road with professionals living near you and working close to your place of work",
      passengers: "Passengers",
      passengersBody:
        "Go to work safely while developing your professional network",
      vehicleOwners: "Vehicle owners",
      vehicleOwnersBody: `Earn money by sharing your daily "home-to-work" commute`,
    },
  },
  fr: {
    greeting: "Bonjour",
    introduction: "Bienvenue sur notre site web !",
    buttonText: "Changer de langue",
    account: "Compte",
    username: "Nom d'utilisateur",
    language: "Langue",
    currentLanguage: "Français",
    faq: "FAQ",
    faqDescription: "Liste des questions fréquemment posées",
    support: "Service client",
    supportEmail: "Envoyer un email à support@yooke.com",
    logout: "Déconnexion",
    accountSettings: "Paramètres du Compte",
    name: "Nom",
    numberPlate: "Plaque d'immatriculation",
    phoneNumber: "Numéro de Téléphone",
    email: "Email",
    saveChanges: "Enregistrer les Modifications",
    homeCarOwner: {
      home: "Accueil",
      acceptingRideRequests: "Accepter les demandes de covoiturage",
      usualLeavingTime: "Heure de départ habituelle",
      stopPointsInfo:
        "Veuillez insérer des points d'arrêt le long de votre trajet où vous pouvez prendre des passagers. Par exemple, si vous habitez à A et travaillez à D mais passez par B et C en allant au travail, vos points d'arrêt sont A, B, C et D.",
      saveChanges: "Enregistrer les Modifications",
      savingChanges: "Enregistrement des modifications...",
    },
    homePassenger: {
      findARide: "Trouver un trajet",
      pickupPoint: "Point de Prise en Charge",
      dropOffPoint: "Point de Dépôt",
      selectDepartureTime: "Sélectionnez l’heure du Départ",
      searchButton: "Rechercher",
    },
    bookingCards: {
      reserveOneSeat: "Réserver 1 place",
      reserveTwoSeats: "Réserver 2 places",
      reserveThreeSeats: "Réserver 3 places",
    },
    selectLocation: {
      searchPlaceholder: "Rechercher",
      labelPlaceholder: "Sélectionner l'emplacement",
    },
    availableRoutes: {
      topMatches: "Meilleures correspondances",
    },
    yourPath: {
      rideDetails: "Détails du trajet",
      sendingRequest: "Envoi de la demande pour partager ce trajet...",
      sendRequest: "Envoyer une demande pour partager ce trajet",
      noRouteFound: "Aucun trajet trouvé.",
      connectionRequestSent: "Demande envoyée avec succès.",
      connectionRequestError:
        "Échec de l'envoi de la demande. Veuillez réessayer.",
      connectionRequestExists:
        "Vous avez déjà envoyé une demande de connexion à ce propriétaire de voiture.",
      departureTimeInfo:
        "L'heure de départ ci-dessus est celle à laquelle ce propriétaire de voiture part généralement. Vous pouvez envisager d'ajuster votre propre heure de départ pour correspondre à la leur. Vous pouvez également contacter le propriétaire de la voiture pour discuter s'il est ouvert à ajuster son heure de départ pour mieux correspondre à votre emploi du temps.",
      seatToBeReserved: "place à réserver",
      seatsToBeReserved: "places à réserver",
    },
    connectionsCarOwner: {
      title: "Connexions",
      noConnectionsAlt: "Aucune connexion",
      noConnectionsMessage: "Vous n'avez pas encore de connexions.",
    },
    connectionsPassenger: {
      title: "Connexions",
      noConnectionsAlt: "Aucune connexion",
      noConnectionsMessage: "Vous n'avez pas encore de connexions.",
    },
    connectionCard: {
      whatsapp: "WhatsApp",
      carImages: "Images de Voiture",
      car: "Voiture",
      messageOnWhatsapp: "Message sur WhatsApp",
    },
    notifications: {
      loading: "Chargement...",
      noUserData: "Erreur : Aucune donnée utilisateur",
      contactSupportOrLogin:
        "Veuillez contacter le support ou réessayer de vous connecter.",
      invalidAccountType: "Erreur : Type de compte invalide",
    },
    notificationsCarOwner: {
      title: "Notifications",
      noNotificationsAlt: "Aucune nouvelle notification",
      noNotificationsMessage: "Aucune nouvelle notification",
      seats: "Sièges",
      time: "Heure",
      ago: "depuis",
      accept: "Accepter",
      reject: "Rejeter",
      confirmRejectionTitle: "Confirmer le rejet",
      confirmRejectionMessage:
        "Êtes-vous sûr de vouloir rejeter cette demande ? Cette action ne peut pas être annulée et vous ne pourrez plus accéder à la demande par la suite.",
      cancel: "Annuler",
      confirm: "Confirmer",
      sentYouAConnectionRequest: "vous a envoyé une demande de connexion.",
      unknownSender: "Inconnu",
    },
    notificationsPassenger: {
      title: "Notifications",
      noNotificationsAlt: "Aucune nouvelle notification",
      noNotificationsMessage: "Aucune nouvelle notification",
      seats: "Sièges",
      time: "Heure",
      ago: "depuis",
      acceptedYourRequest: "a accepté votre demande de connexion.",
      unknownSender: "Inconnu",
    },
    notificationsLegacy: {
      title: "Notifications",
      acceptedRequest: "a accepté votre demande de connexion.",
      sentRequest: "vous a envoyé une demande de connexion.",
    },
    faqs: {
      title: "FAQs",
      question1:
        "Comment puis-je faciliter la recherche de ma part en tant que propriétaire de voiture?",
      answer1:
        "Sur votre page d'accueil, assurez-vous d'ajouter tous vos points d'arrêt dans le champ des points d'arrêt et de sauvegarder.",
      question2: "Comment trouver un trajet à partager?",
      answer2:
        "Utilisez votre page d'accueil pour rechercher en utilisant les filtres que nous avons mis à disposition.",
      question3: "Comment communiquer avec ma correspondance?",
      answer3:
        "Vous pouvez utiliser le bouton Message dans WhatsApp ou ajouter manuellement leur contact dans votre téléphone et leur envoyer un message sur WhatsApp.",
      question4: "Que se passe-t-il après que je me connecte?",
      answer4:
        "Vos connexions sont disponibles dans l'onglet connexions. Vous pouvez les contacter pour convenir d'un lieu de rendez-vous lors du trajet.",
    },
    settings: {
      uploadCarImages: "Télécharger des images de voiture",
      preview: "Aperçu",
      updateError:
        "Échec de la mise à jour des données utilisateur. Veuillez réessayer.",
      phoneNumberHelper: "Veuillez entrer votre numéro au format : 15551234567",
    },
    appLayout: {
      home: "Accueil",
      connections: "Connexions",
      notifications: "Notifications",
      account: "Compte",
      newConnectionRequest:
        "Félicitations ! Vous avez une nouvelle demande de connexion",
      acceptedRequest: "Félicitations ! Vous avez une demande acceptée",
    },
    languageSettings: "Langue",
    english: "Anglais",
    french: "Français",
    landingPage: {
      language: "Langue",
      login: "Connexion",
      pilotPhase: "Phase pilote",
      beOneOfTheFirst: "Soyez l'un des premiers",
      secureCarpooling: "Covoiturage Sécurisé pour les Femmes Professionnelles",
      streamlineCommute:
        "Conçu pour protéger les femmes professionnelles des agressions et du harcèlement dans les transports publics.",
      joinWaitingList: "Rejoindre la liste d'attente",
      joinWaitingListButton: "Rejoindre",

      putInObjectsCalled: "mettre dans des objets appelés",
      landingPage: "page d'accueil",

      partnerCompanies: "Entreprises partenaires",
      partnerCompaniesBody:
        "Réservé exclusivement aux professionnels des entreprises partenaires",
      friendliness: "Convivialité",
      friendlinessBody:
        "Partagez la route avec des professionnels résidant près de chez vous et travaillant à proximité de votre lieu de service",
      passengers: "Passagers",
      passengersBody:
        "Allez au travail en toute sécurité tout en développant votre réseau professionnel",
      vehicleOwners: "Propriétaires de véhicules",
      vehicleOwnersBody: `Gagnez de l'argent en partageant votre trajet quotidien "domicile-travail"`,
    },
  },
};

// Create a provider component
const LanguageProvider = ({ children }) => {
  // Set the initial state using localStorage, defaulting to 'en'
  const [languageCode, setLanguageCode] = useState(
    localStorage.getItem("appLanguage") || "fr"
  );

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("appLanguage", languageCode);
  }, [languageCode]);

  const changeLanguage = (newLanguageCode) => {
    setLanguageCode(newLanguageCode);
  };

  const currentLanguage = languages[languageCode];

  return (
    <LanguageContext.Provider
      value={{ language: currentLanguage, languageCode, changeLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };
