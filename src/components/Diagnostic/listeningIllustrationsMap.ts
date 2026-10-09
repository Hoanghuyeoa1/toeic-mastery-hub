import React from 'react';
import {
  OfficeWomanPhoto,
  ConferenceRoomPhoto,
  ManTypingLaptopPhoto,
  WarehouseLoadingPhoto,
  ConstructionWorkerPhoto,
  ChefPreparingFoodPhoto,
  CustomerCashierPhoto,
  LibraryReaderPhoto,
  AirportConveyorPhoto,
  ParkBenchFountainPhoto,
  FlightScheduleGraphic,
  StoreDirectoryGraphic,
} from './Part1Illustrations';

/**
 * Registry mapping illustration IDs to React SVG Illustration components
 */
export const LISTENING_ILLUSTRATIONS: Record<string, React.FC> = {
  office_woman_photo: OfficeWomanPhoto,
  conference_room_photo: ConferenceRoomPhoto,
  man_typing_laptop: ManTypingLaptopPhoto,
  warehouse_loading_boxes: WarehouseLoadingPhoto,
  construction_site_worker: ConstructionWorkerPhoto,
  chef_preparing_food: ChefPreparingFoodPhoto,
  customer_cashier_counter: CustomerCashierPhoto,
  library_bookshelves_reader: LibraryReaderPhoto,
  airport_luggage_conveyor: AirportConveyorPhoto,
  park_bench_fountain: ParkBenchFountainPhoto,
  flight_schedule_graphic: FlightScheduleGraphic,
  store_directory_graphic: StoreDirectoryGraphic,
};
