export const sv = {
  common: {
    save: 'Spara ändringar',
    saved: 'Ändringarna har sparats',
    loading: 'Laddar...',
    error: 'Fel',
    success: 'Klart',
    cancel: 'Avbryt',
    close: 'Stäng',
    yes: 'Ja',
    no: 'Nej',
  },
  dashboard: {
    title: 'KENYA AIRWAYS NEXUS',
    subtitle: 'Flygplansdelssystem',
    performance: {
      title: 'Systemprestanda',
      metrics: {
        cpu: 'CPU-användning',
        memory: 'Minne',
        network: 'Nätverk',
        chart: {
          timeLabel: 'Tid',
          valueLabel: 'Användning %'
        }
      }
    },
    inventoryStatus: {
      title: 'Lagerstatus',
      stockLevel: 'Lagernivå',
      orderStatus: 'Beställningsstatus',
      items: 'artiklar',
      pending: 'väntande',
      lastUpdate: 'Senaste uppdatering',
      database: 'Databas'
    },
    securityStatus: {
      title: 'Säkerhetsstatus',
      firewall: 'Brandvägg',
      firewallStatus: 'Aktiv',
      encryption: 'Kryptering',
      encryptionStatus: 'Aktiverad',
      threatLevel: 'Hotnivå',
      threatStatus: 'Låg'
    },
    alerts: {
      title: 'Systemvarningar',
      lowStock: '{count} artiklar med lågt lager',
      normalStock: 'Alla lagernivåer normala',
      systemUpdate: 'Systemuppdatering tillgänglig'
    },
    menu: {
      dashboard: 'Dashboard',
      inventory: 'Inventarie',
      orders: 'Beställningar',
      analytics: 'Analys',
      dataCenter: 'Datacenter',
      network: 'Nätverk',
      security: 'Säkerhet',
      console: 'Konsol',
      communications: 'Kommunikation',
      settings: 'Inställningar',
    },
    metrics: {
      systemStatus: 'Systemstatus',
      uptime: 'Drifttid',
      errors: 'Felantal',
      apiRequests: 'API-förfrågningar',
      coreSystems: 'Kärnsystem',
      security: 'Säkerhet',
      network: 'Nätverk',
    },
    quickActions: {
      title: 'Snabbåtgärder',
      export: 'Exportera',
    },
    status: {
      live: 'LIVE',
      demo: 'Demoläge',
      connected: 'Ansluten',
      systemTime: 'SYSTEMTID',
    },
  },
  settings: {
    title: 'Inställningar',
    subtitle: 'Hantera din profil och kontoinställningar',
    profile: {
      title: 'Profilinformation',
      name: 'Namn',
      email: 'E-post',
    },
    preferences: {
      title: 'Kontoinställningar',
      language: 'Språk',
      darkMode: 'Aktivera mörkt läge',
    },
  },
  security: {
    title: 'Säkerhetsinställningar',
    subtitle: 'Hantera din kontosäkerhet',
    password: {
      title: 'Ändra lösenord',
      current: 'Nuvarande lösenord',
      new: 'Nytt lösenord',
      confirm: 'Bekräfta lösenord',
      update: 'Uppdatera lösenord',
    },
    twoFactor: {
      title: 'Tvåfaktorsautentisering',
      enable: 'Aktivera tvåfaktorsautentisering',
      setup: 'Konfigurera 2FA',
    },
    sessions: {
      title: 'Aktiva sessioner',
      lastActive: 'Senast aktiv',
      logout: 'Logga ut',
    },
  },
  communications: {
    title: 'Kommunikation',
    subtitle: 'Hantera dina aviseringsinställningar och visa meddelandehistorik',
    preferences: {
      title: 'Aviseringsinställningar',
      email: 'E-postaviseringar',
      sms: 'SMS-aviseringar',
    },
    messages: {
      title: 'Meddelandehistorik',
      type: 'Typ',
      content: 'Innehåll',
      sentDate: 'Skickat datum',
    },
  },
  console: {
    title: 'Konsol',
    subtitle: 'Övervaka systemvärden och senaste loggar',
    metrics: {
      title: 'Systemstatus',
      uptime: 'Drifttid',
      errors: 'Felantal',
      requests: 'API-förfrågningar',
    },
    logs: {
      title: 'Senaste loggar',
      eventType: 'Händelsetyp',
      timestamp: 'Tidsstämpel',
      message: 'Meddelande',
    },
  },
  inventory: {
    title: 'Lagerhantering',
    upload: {
      title: 'Ladda upp lagerdata',
      button: 'Ladda upp fil',
    },
    overview: {
      title: 'Lageröversikt',
    },
    items: {
      title: 'Lagerartiklar',
    },
  },
  orders: {
    title: 'Beställningshantering',
    upload: {
      title: 'Ladda upp beställningsdata',
    },
    overview: {
      title: 'Beställningsöversikt',
    },
    recent: {
      title: 'Senaste beställningar',
    },
  },
  analytics: {
    title: 'Analysdashboard',
    upload: {
      title: 'Ladda upp data för analys',
    },
    demand: {
      title: 'Reservdelsbehovsanalys',
    },
    trends: {
      title: 'Lagertrender',
    },
  },
  languages: {
    en: 'Engelska',
    sv: 'Svenska',
    fr: 'Franska',
    de: 'Tyska',
  },
};
