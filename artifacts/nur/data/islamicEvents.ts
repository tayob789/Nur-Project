export interface IslamicEvent {
  hijriMonth: number;
  hijriDay: number;
  name: string;
  description: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { hijriMonth: 1, hijriDay: 1, name: 'Islamic New Year', description: 'The beginning of the new Hijri year, marking the migration (Hijra) of the Prophet ﷺ from Mecca to Medina.' },
  { hijriMonth: 1, hijriDay: 10, name: 'Day of Ashura', description: 'The day Allah saved Musa (AS) and the Children of Israel from Pharaoh. Fasting is highly recommended.' },
  { hijriMonth: 3, hijriDay: 12, name: 'Mawlid an-Nabi ﷺ', description: 'The birth of the Prophet Muhammad ﷺ, a time for reflecting on his life and teachings.' },
  { hijriMonth: 7, hijriDay: 27, name: "Isra' and Mi'raj", description: "The Night Journey and Ascension of the Prophet ﷺ to the heavens, during which the five daily prayers were ordained." },
  { hijriMonth: 8, hijriDay: 15, name: "Shab-e-Barat", description: "The Night of Records in the month of Sha'ban. A time for worship, seeking forgiveness, and reflecting on the year ahead." },
  { hijriMonth: 9, hijriDay: 1, name: 'First Day of Ramadan', description: 'The holy month of fasting begins. Muslims fast from dawn to sunset, intensifying worship and recitation of the Quran.' },
  { hijriMonth: 9, hijriDay: 15, name: 'Mid-Ramadan', description: 'The middle of the blessed month of Ramadan.' },
  { hijriMonth: 9, hijriDay: 21, name: "Last Ten Nights of Ramadan Begin", description: "The most virtuous nights of the year begin. The Prophet ﷺ would increase his worship during these nights." },
  { hijriMonth: 9, hijriDay: 27, name: 'Laylatul Qadr (estimated)', description: "The Night of Power — better than a thousand months. Most commonly on the 27th night of Ramadan, though it should be sought in all odd nights of the last ten." },
  { hijriMonth: 10, hijriDay: 1, name: 'Eid al-Fitr', description: "The festival celebrating the end of Ramadan. A day of celebration, gratitude, prayer, and giving Zakat al-Fitr." },
  { hijriMonth: 12, hijriDay: 8, name: "Pilgrims Enter Mina", description: "Hajj pilgrims travel to Mina on the 8th of Dhul Hijjah (Yawm at-Tarwiyah)." },
  { hijriMonth: 12, hijriDay: 9, name: 'Day of Arafah', description: "The greatest day of the year. Pilgrims stand at the plain of Arafah. Fasting on this day expiates sins of the past and coming year for non-pilgrims." },
  { hijriMonth: 12, hijriDay: 10, name: 'Eid al-Adha', description: "The festival of sacrifice, commemorating Ibrahim's (AS) willingness to sacrifice his son. Muslims who can afford it sacrifice an animal." },
  { hijriMonth: 12, hijriDay: 11, name: "Days of Tashriq Begin", description: "The three days following Eid al-Adha. Eating, drinking, and remembering Allah are emphasized." },
];
