export type Drink = {
    id: string;                 // Unique identifier (use uuid or timestamp)
    label: string;             // Name/type of the drink
    caffeineMg: number;         // Total caffeine in milligrams
    time: string;               // Time drink was consumed, in "HH:mm" format (24hr)
    durationMin: number;        // Time it took to consume, in minutes (default to 0 if instant)
};
