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
  created_at: string;
}
