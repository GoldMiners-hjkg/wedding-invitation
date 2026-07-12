export interface RSVPFormData {
  full_name: string;
  attending: boolean | null;
  num_guests: number;
  hotel_needed: boolean;
  hotel_check_in_dates: string[];
  hotel_num_guests: number;
  arrival_time: string;
  flight_number: string;
  flight_arrival_time: string;
  arriving_airport: string;
  dietary_requirements: string;
  note_to_couple: string;
}

export interface RSVPResponse extends RSVPFormData {
  id: string;
  attending: boolean;
  /** Persisted night count for hotel booking (1 or 2); null if no hotel */
  hotel_num_nights: number | null;
  created_at: string;
}
