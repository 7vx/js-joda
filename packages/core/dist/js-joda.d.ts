// ----------------------------------------------------------------------------
//   TEMPORAL
// ----------------------------------------------------------------------------

/**
 * A field of date-time, such as month-of-year or hour-of-minute.
 *
 * Date and time is expressed using fields which partition the time-line into something meaningful
 * for humans. Implementations of this interface represent those fields.
 *
 * The most commonly used units are defined in `ChronoField`. Further fields are supplied in
 * `IsoFields`. Fields can also be written by application code by implementing this interface.
 */
export interface TemporalField {
    /** Checks if this field is supported by the temporal object. */
    isSupportedBy(temporal: TemporalAccessor): boolean;
    /** Checks if this field represents a component of a date. */
    isDateBased(): boolean;
    /** Checks if this field represents a component of a time. */
    isTimeBased(): boolean;
    /** Gets the unit that the field is measured in. */
    baseUnit(): TemporalUnit;
    /** Gets the range that the field is bound by. */
    rangeUnit(): TemporalUnit;
    /** Gets the range of valid values for the field. */
    range(): ValueRange;
    /**
     * Get the range of valid values for this field using the temporal object to
     * refine the result.
     */
    rangeRefinedBy(temporal: TemporalAccessor): ValueRange;
    /** Gets the value of this field from the specified temporal object. */
    getFrom(temporal: TemporalAccessor): number;
    /** Returns a copy of the specified temporal object with the value of this field set. */
    adjustInto<R extends Temporal>(temporal: R, newValue: number): R;
    name(): string;
    displayName(/* TODO: locale */): string;
    equals(other: any): boolean;
}

/**
 * A unit of date-time, such as Days or Hours.
 *
 * Measurement of time is built on units, such as years, months, days, hours, minutes and seconds.
 * Implementations of this interface represent those units.
 *
 * An instance of this interface represents the unit itself, rather than an amount of the unit.
 * See `Period` for a class that represents an amount in terms of the common units.
 *
 * The most commonly used units are defined in `ChronoUnit`. Further units are supplied in
 * `IsoFields`. Units can also be written by application code by implementing this interface.
 */
export interface TemporalUnit {
    /** Returns a copy of the specified temporal object with the specified period added. */
    addTo<T extends Temporal>(temporal: T, amount: number): T;
    /**
     * Calculates the period in terms of this unit between two temporal objects of the same type.
     *
     * Returns the period between temporal1 and temporal2 in terms of this unit; a positive number
     * if `temporal2` is later than `temporal1`, negative if earlier.
     */
    between(temporal1: Temporal, temporal2: Temporal): number;
    /** Gets the duration of this unit, which may be an estimate. */
    duration(): Duration;
    /** Checks if this unit is date-based. */
    isDateBased(): boolean;
    /** Checks if the duration of the unit is an estimate. */
    isDurationEstimated(): boolean;
    /** Checks if this unit is supported by the specified temporal object. */
    isSupportedBy(temporal: Temporal): boolean;
    /** Checks if this unit is time-based. */
    isTimeBased(): boolean;
}

interface Prototype<T> {
    readonly prototype: T
}

/**
 * The range of valid values for a date-time field.
 *
 * All TemporalField instances have a valid range of values. For example, the ISO day-of-month
 * runs from 1 to somewhere between 28 and 31. This class captures that valid range.
 *
 * It is important to be aware of the limitations of this class. Only the minimum and maximum
 * values are provided. It is possible for there to be invalid values within the outer range.
 * For example, a weird field may have valid values of 1, 2, 4, 6, 7, thus have a range of '1 - 7',
 * despite that fact that values 3 and 5 are invalid.
 *
 * Instances of this class are not tied to a specific field.
 */
export const ValueRange: ValueRangeConstructor

export interface ValueRangeConstructor extends Prototype<ValueRange> {
    of(min: number, max: number): ValueRange;
    of(min: number, maxSmallest: number, maxLargest: number): ValueRange;
    of(minSmallest: number, minLargest: number, maxSmallest: number, maxLargest: number): ValueRange;
}

export interface ValueRange {
    checkValidValue(value: number, field: TemporalField): number;
    checkValidIntValue(value: number, field: TemporalField): number;
    equals(other: any): boolean;
    hashCode(): number;
    isFixed(): boolean;
    isIntValue(): boolean;
    isValidIntValue(value: number): boolean;
    isValidValue(value: number): boolean;
    largestMinimum(): number;
    maximum(): number;
    minimum(): number;
    smallestMaximum(): number;
    toString(): string;
}

/**
 * Framework-level class defining an amount of time, such as "6 hours", "8 days" or
 * "2 years and 3 months".
 *
 * This is the base class type for amounts of time. An amount is distinct from a date or
 * time-of-day in that it is not tied to any specific point on the time-line.
 *
 * The amount can be thought of as a `Map` of `TemporalUnit` to `number`, exposed via
 * `units()` and `get()`. A simple case might have a single unit-value pair, such
 * as "6 hours". A more complex case may have multiple unit-value pairs, such as "7 years,
 * 3 months and 5 days".
 *
 * There are two common implementations. `Period` is a date-based implementation,
 * storing years, months and days. `Duration` is a time-based implementation, storing
 * seconds and nanoseconds, but providing some access using other duration based units such
 * as minutes, hours and fixed 24-hour days.
 *
 * This class is a framework-level class that should not be widely used in application code.
 * Instead, applications should create and pass around instances of concrete types, such as
 * `Period` and `Duration`.
 */
export interface TemporalAmount {
    /**
     * This adds to the specified temporal object using the logic encapsulated in the
     * implementing class.
     *
     * There are two equivalent ways of using this method. The first is to invoke this method
     * directly. The second is to use `Temporal.plus(TemporalAmount)`:
     *
     * ```
     * // these two lines are equivalent, but the second approach is recommended
     * dateTime = amount.addTo(dateTime);
     * dateTime = dateTime.plus(amount);
     * ```
     *
     * It is recommended to use the second approach, `plus(TemporalAmount)`, as it is a lot
     * clearer to read in code.
     */
    addTo<T extends Temporal>(temporal: T): T;
    /** Gets the amount associated with the specified unit. */
    get(unit: TemporalUnit): number;
    /** Gets the list of units, from largest to smallest, that fully define this amount. */
    units(): TemporalUnit[];
    /**
     * This substract to the specified temporal object using the logic encapsulated in the
     * implementing class.
     *
     * There are two equivalent ways of using this method. The first is to invoke this method
     * directly. The second is to use `Temporal.minus(TemporalAmount)`:
     * ```
     * // these two lines are equivalent, but the second approach is recommended
     * dateTime = amount.substractFrom(dateTime);
     * dateTime = dateTime.minus(amount);
     * ```
     *
     * It is recommended to use the second approach, `minus(TemporalAmount)`, as it is a lot
     * clearer to read in code.
     */
    subtractFrom<T extends Temporal>(temporal: T): T;
}

/**
 * Framework-level interface defining read-only access to a temporal object, such as a date, time,
 * offset or some combination of these.
 *
 * This is the base interface type for date, time and offset objects. It is implemented by those
 * classes that can provide information as fields or queries.
 *
 * Most date and time information can be represented as a number. These are modeled using
 * `TemporalField` with the number held using a long to handle large values. Year, month and
 * day-of-month are simple examples of fields, but they also include instant and offsets. See
 * `ChronoField` for the standard set of fields.
 *
 * Two pieces of date/time information cannot be represented by numbers, the chronology and the
 * time-zone. These can be accessed via queries using the static methods defined on
 * `TemporalQueries`.
 *
 * A sub-interface, `Temporal`, extends this definition to one that also supports adjustment and
 * manipulation on more complete temporal objects.
 *
 * This interface is a framework-level interface that should not be widely used in application code.
 * Instead, applications should create and pass around instances of concrete types, such as
 * `LocalDate`. There are many reasons for this, part of which is that implementations of this
 * interface may be in calendar systems other than ISO. See `ChronoLocalDate` for a fuller
 * discussion of the issues.
 */
export interface TemporalAccessor {
    /**
     * Gets the value of the specified field as an integer number.
     *
     * This queries the date-time for the value for the specified field. The returned value will
     * always be within the valid range of values for the field. If the date-time cannot return
     * the value, because the field is unsupported or for some other reason, an exception will
     * be thrown.
     */
    get(field: TemporalField): number;
    /**
     * Queries this date-time.
     *
     * This queries this date-time using the specified query strategy object.
     *
     * Queries are a key tool for extracting information from date-times. They exists to
     * externalize the process of querying, permitting different approaches, as per the strategy
     * design pattern. Examples might be a query that checks if the date is the day before
     * February 29th in a leap year, or calculates the number of days to your next birthday.
     *
     * The most common query implementations are method references, such as `LocalDate::FROM` and
     * `ZoneId::FROM`. Further implementations are on `TemporalQueries`. Queries may also be
     * defined by applications.
     */
    query<R>(query: TemporalQuery<R>): R | null;
    /**
     * Gets the range of valid values for the specified field.
     *
     * All fields can be expressed as an integer number. This method returns an object that
     * describes the valid range for that value. The value of this temporal object is used to
     * enhance the accuracy of the returned range. If the date-time cannot return the range,
     * because the field is unsupported or for some other reason, an exception will be thrown.
     *
     * Note that the result only describes the minimum and maximum valid values and it is
     * important not to read too much into them. For example, there could be values within the
     * range that are invalid for the field.
     */
    range(field: TemporalField): ValueRange;
    getLong(field: TemporalField): number;
    /**
     * Checks if the specified field is supported.
     *
     * This checks if the date-time can be queried for the specified field. If false, then
     * calling the `range` and `get` methods will throw an exception.
     */
    isSupported(field: TemporalField): boolean;
}

/**
 * Framework-level interface defining read-write access to a temporal object, such as a date, time,
 * offset or some combination of these.
 *
 * This is the base interface type for date, time and offset objects that are complete enough to be
 * manipulated using plus and minus. It is implemented by those classes that can provide and
 * manipulate information as fields or queries. See `TemporalAccessor` for the read-only version of
 * this interface.
 *
 * Most date and time information can be represented as a number. These are modeled using
 * `TemporalField` with the number held using a long to handle large values. Year, month and
 * day-of-month are simple examples of fields, but they also include instant and offsets. See
 * `ChronoField` for the standard set of fields.
 *
 * Two pieces of date/time information cannot be represented by numbers, the chronology and the
 * time-zone. These can be accessed via queries using the static methods defined on
 * `TemporalQueries`.
 *
 * This interface is a framework-level interface that should not be widely used in application code.
 * Instead, applications should create and pass around instances of concrete types, such as
 * `LocalDate`. There are many reasons for this, part of which is that implementations of this
 * interface may be in calendar systems other than ISO. See `ChronoLocalDate` for a fuller
 * discussion of the issues.
 */
export interface Temporal extends TemporalAccessor {
    minus(amountToSubtract: number, unit: TemporalUnit): Temporal;
    /**
     * Returns an object of the same type as this object with an amount subtracted.
     *
     * This adjusts this temporal, subtracting according to the rules of the specified amount.
     * The amount is typically a `Period` but may be any other type implementing `TemporalAmount`,
     * such as `Duration`.
     *
     * Some example code indicating how and why this method is used:
     * ```
     * date = date.minus(period);                  // subtract a Period instance
     * date = date.minus(duration);                // subtract a Duration instance
     * date = date.minus(workingDays(6));          // example user-written workingDays method
     * ```
     *
     * Note that calling plus followed by minus is not guaranteed to return the same date-time.
     */
    minus(amount: TemporalAmount): Temporal;
    plus(amountToAdd: number, unit: TemporalUnit): Temporal;
    /**
     * Returns an object of the same type as this object with an amount added.
     *
     * This adjusts this temporal, adding according to the rules of the specified amount. The
     * amount is typically a `Period` but may be any other type implementing `TemporalAmount`,
     * such as `Duration`.
     *
     * Some example code indicating how and why this method is used:
     * ```
     * date = date.plus(period);                  // add a Period instance
     * date = date.plus(duration);                // add a Duration instance
     * date = date.plus(workingDays(6));          // example user-written workingDays method
     * ```
     *
     * Note that calling plus followed by minus is not guaranteed to return the same date-time.
     */
    plus(amount: TemporalAmount): Temporal;
    /**
     * Returns an adjusted object of the same type as this object with the adjustment made.
     *
     * This adjusts this date-time according to the rules of the specified adjuster. A simple
     * adjuster might simply set the one of the fields, such as the year field. A more complex
     * adjuster might set the date to the last day of the month. A selection of common adjustments
     * is provided in `TemporalAdjusters`. These include finding the "last day of the month" and
     * "next Wednesday". The adjuster is responsible for handling special cases, such as the
     * varying lengths of month and leap years.
     *
     * Some example code indicating how and why this method is used:
     * ```
     * date = date.with(Month.JULY);        // most key classes implement TemporalAdjuster
     * date = date.with(lastDayOfMonth());  // static import from TemporalAdjusters
     * date = date.with(next(WEDNESDAY));   // static import from TemporalAdjusters and DayOfWeek
     * ```
     */
    with(adjuster: TemporalAdjuster): Temporal;
    /**
     * Returns an object of the same type as this object with the specified field altered.
     *
     * This returns a new object based on this one with the value for the specified field changed.
     * For example, on a `LocalDate`, this could be used to set the year, month or day-of-month.
     * The returned object will have the same observable type as this object.
     *
     * In some cases, changing a field is not fully defined. For example, if the target object is
     * a date representing the 31st January, then changing the month to February would be unclear.
     * In cases like this, the field is responsible for resolving the result. Typically it will
     * choose the previous valid date, which would be the last valid day of February in this
     * example.
     */
    with(field: TemporalField, newValue: number): Temporal;

    isSupported(field: TemporalField): boolean;
    /**
     * Checks if the specified unit is supported.
     *
     * This checks if the date-time can be queried for the specified unit. If false, then calling
     * the plus and minus methods will throw an exception.
     */
    isSupported(unit: TemporalUnit): boolean;

    /**
     * Calculates the period between this temporal and another temporal in terms of the
     * specified unit.
     *
     * This calculates the period between two temporals in terms of a single unit. The start
     * and end points are this and the specified temporal. The result will be negative if the
     * end is before the start. For example, the period in hours between two temporal objects
     * can be calculated using `startTime.until(endTime, HOURS)`.
     *
     * The calculation returns a whole number, representing the number of complete units between
     * the two temporals. For example, the period in hours between the times 11:30 and 13:29 will
     * only be one hour as it is one minute short of two hours.
     *
     * There are two equivalent ways of using this method. The first is to invoke this method
     * directly. The second is to use `TemporalUnit.between(Temporal, Temporal)`:
     * ```
     * // these two lines are equivalent
     * between = thisUnit.between(start, end);
     * between = start.until(end, thisUnit);
     * ```
     *
     * The choice should be made based on which makes the code more readable.
     *
     * For example, this method allows the number of days between two dates to be calculated:
     * ```
     * const daysBetween = DAYS.between(start, end);
     * // or alternatively
     * const daysBetween = start.until(end, DAYS);
     * ```
     */
    until(endTemporal: Temporal, unit: TemporalUnit): number;
}

/**
 * Strategy for adjusting a temporal object.
 *
 * Adjusters are a key tool for modifying temporal objects. They exist to externalize the process
 * of adjustment, permitting different approaches, as per the strategy design pattern. Examples
 * might be an adjuster that sets the date avoiding weekends, or one that sets the date to the
 * last day of the month.
 *
 * There are two equivalent ways of using a `TemporalAdjuster`. The first is to invoke the method
 * on this interface directly. The second is to use `Temporal.with(TemporalAdjuster)`:
 *
 * ```
 * // these two lines are equivalent, but the second approach is recommended
 * temporal = thisAdjuster.adjustInto(temporal);
 * temporal = temporal.with(thisAdjuster);
 * ```
 *
 * It is recommended to use the second approach, `with(TemporalAdjuster)`, as it is a lot clearer
 * to read in code.
 *
 * See `TemporalAdjusters` for a standard set of adjusters, including finding the last day of
 * the month. Adjusters may also be defined by applications.
 */
export interface TemporalAdjuster {
    adjustInto(temporal: Temporal): Temporal;
}

export interface TemporalQuery<R> {
    queryFrom(temporal: TemporalAccessor): R;
}

/**
 A standard set of fields.
 *
 * This set of fields provide field-based access to manipulate a date, time or date-time.
 * The standard set of fields can be extended by implementing {@link TemporalField}.
 */

export const ChronoField: ChronoFieldConstructor

export interface ChronoFieldConstructor extends Prototype<ChronoField> {
    /**
     * This represents concept of the count of
     * days within the period of a week where the weeks are aligned to the start of the month.
     * This field is typically used with `ALIGNED_WEEK_OF_MONTH`.
     */
    ALIGNED_DAY_OF_WEEK_IN_MONTH: ChronoField;
    /**
     * This represents concept of the count of days
     * within the period of a week where the weeks are aligned to the start of the year.
     * This field is typically used with `ALIGNED_WEEK_OF_YEAR`.
     */
    ALIGNED_DAY_OF_WEEK_IN_YEAR: ChronoField;
    /**
     * This represents concept of the count of weeks within
     * the period of a month where the weeks are aligned to the start of the month. This field
     * is typically used with `ALIGNED_DAY_OF_WEEK_IN_MONTH`.
     */
    ALIGNED_WEEK_OF_MONTH: ChronoField;
    /**
     * his represents concept of the count of weeks within
     * the period of a year where the weeks are aligned to the start of the year. This field
     * is typically used with `ALIGNED_DAY_OF_WEEK_IN_YEAR`.
     */
    ALIGNED_WEEK_OF_YEAR: ChronoField;
    /**
     * This counts the AM/PM within the day, from 0 (AM) to 1 (PM).
     */
    AMPM_OF_DAY: ChronoField;
    /**
     * This counts the hour within the AM/PM, from 1 to 12.
     * This is the hour that would be observed on a standard 12-hour analog wall clock.
     */
    CLOCK_HOUR_OF_AMPM: ChronoField;
    /**
     * This counts the hour within the AM/PM, from 1 to 24.
     * This is the hour that would be observed on a 24-hour analog wall clock.
     */
    CLOCK_HOUR_OF_DAY: ChronoField;
    /**
     * This represents the concept of the day within the month.
     * In the default ISO calendar system, this has values from 1 to 31 in most months.
     * April, June, September, November have days from 1 to 30, while February has days from
     * 1 to 28, or 29 in a leap year.
     */
    DAY_OF_MONTH: ChronoField;
    /**
     * This represents the standard concept of the day of the week.
     * In the default ISO calendar system, this has values from Monday (1) to Sunday (7).
     * The {@link DayOfWeek} class can be used to interpret the result.
     */
    DAY_OF_WEEK: ChronoField;
    /**
     * This represents the concept of the day within the year.
     * In the default ISO calendar system, this has values from 1 to 365 in standard years and
     * 1 to 366 in leap years.
     */
    DAY_OF_YEAR: ChronoField;
    /**
     * This field is the sequential count of days where
     * 1970-01-01 (ISO) is zero. Note that this uses the local time-line, ignoring offset and
     * time-zone.
     */
    EPOCH_DAY: ChronoField;
    /**
     * This represents the concept of the era, which is the largest
     * division of the time-line. This field is typically used with `YEAR_OF_ERA`.
     *
     * In the default ISO calendar system, there are two eras defined, 'BCE' and 'CE'. The era
     * 'CE' is the one currently in use and year-of-era runs from 1 to the maximum value.
     * The era 'BCE' is the previous era, and the year-of-era runs backwards.
     */
    ERA: ChronoField;
    /**
     * This counts the hour within the AM/PM, from 0 to 11.
     * This is the hour that would be observed on a standard 12-hour digital clock.
     */
    HOUR_OF_AMPM: ChronoField;
    /**
     * This counts the hour within the day, from 0 to 23. This is
     * the hour that would be observed on a standard 24-hour digital clock.
     */
    HOUR_OF_DAY: ChronoField;
    /**
     * This represents the concept of the sequential count of
     * seconds where `1970-01-01T00:00Z` (ISO) is zero. This field may be used with `NANO_OF_DAY`
     * to represent the fraction of the day.
     *
     * An Instant represents an instantaneous point on the time-line. On their own they have
     * no elements which allow a local date-time to be obtained. Only when paired with an offset
     * or time-zone can the local date or time be found. This field allows the seconds part of
     * the instant to be queried.
     */
    INSTANT_SECONDS: ChronoField;
    /**
     * This counts the microsecond within the day, from `0` to
     * `(24 * 60 * 60 * 1_000_000) - 1`.
     *
     * This field is used to represent the micro-of-day handling any fraction of the second.
     * Implementations of {@link TemporalAccessor} should provide a value for this field if they
     * can return a value for `SECOND_OF_DAY` filling unknown precision with zero.
     *
     * When this field is used for setting a value, it should behave in the same way as
     * setting `NANO_OF_DAY` with the value multiplied by 1,000.
     */
    MICRO_OF_DAY: ChronoField;
    /**
     * This counts the microsecond within the second, from 0 to 999,999.
     *
     * This field is used to represent the micro-of-second handling any fraction of the second.
     * Implementations of {@link TemporalAccessor} should provide a value for this field if they
     * can return a value for `SECOND_OF_MINUTE`, `SECOND_OF_DAY` or `INSTANT_SECONDS` filling
     * unknown precision with zero.
     */
    MICRO_OF_SECOND: ChronoField;
    /**
     * This counts the millisecond within the day, from 0 to
     * `(24 * 60 * 60 * 1,000) - 1`.
     *
     * This field is used to represent the milli-of-day handling any fraction of the second.
     * Implementations of {@link TemporalAccessor} should provide a value for this field if they
     * can return a value for `SECOND_OF_DAY` filling unknown precision with zero.
     *
     * When this field is used for setting a value, it should behave in the same way as
     * setting `NANO_OF_DAY` with the value multiplied by 1,000,000.
     */
    MILLI_OF_DAY: ChronoField;
    /**
     * This counts the millisecond within the second, from 0 to
     * 999.
     *
     * This field is used to represent the milli-of-second handling any fraction of the second.
     * Implementations of {@link TemporalAccessor} should provide a value for this field if they can
     * return a value for `SECOND_OF_MINUTE`, `SECOND_OF_DAY` or `INSTANT_SECONDS` filling unknown
     * precision with zero.
     *
     * When this field is used for setting a value, it should behave in the same way as
     * setting `NANO_OF_SECOND` with the value multiplied by 1,000,000.
     */
    MILLI_OF_SECOND: ChronoField;
    /**
     * This counts the minute within the day, from 0 to `(24 * 60) - 1`.
     */
    MINUTE_OF_DAY: ChronoField;
    /**
     * This counts the minute within the hour, from 0 to 59.
     */
    MINUTE_OF_HOUR: ChronoField;
    /**
     * The month-of-year, such as March. This represents the concept
     * of the month within the year. In the default ISO calendar system, this has values from
     * January (1) to December (12).
     */
    MONTH_OF_YEAR: ChronoField;
    /**
     * This counts the nanosecond within the day, from 0 to
     * `(24 * 60 * 60 * 1,000,000,000) - 1`.
     *
     * This field is used to represent the nano-of-day handling any fraction of the second.
     * Implementations of {@link TemporalAccessor} should provide a value for this field if they
     * can return a value for `SECOND_OF_DAY` filling unknown precision with zero.
     */
    NANO_OF_DAY: ChronoField;
    /**
     * This counts the nanosecond within the second, from 0
     * to 999,999,999.
     *
     * This field is used to represent the nano-of-second handling any fraction of the second.
     * Implementations of {@link TemporalAccessor} should provide a value for this field if they
     * can return a value for `SECOND_OF_MINUTE`, `SECOND_OF_DAY` or `INSTANT_SECONDS` filling
     * unknown precision with zero.
     *
     * When this field is used for setting a value, it should set as much precision as the
     * object stores, using integer division to remove excess precision. For example, if the
     * {@link TemporalAccessor} stores time to millisecond precision, then the nano-of-second must
     * be divided by 1,000,000 before replacing the milli-of-second.
     */
    NANO_OF_SECOND: ChronoField;
    /**
     * This represents the concept of the offset in seconds of
     * local time from UTC/Greenwich.
     *
     * A {@link ZoneOffset} represents the period of time that local time differs from
     * UTC/Greenwich. This is usually a fixed number of hours and minutes. It is equivalent to
     * the total amount of the offset in seconds. For example, during the winter Paris has an
     * offset of +01:00, which is 3600 seconds.
     */
    OFFSET_SECONDS: ChronoField;
    /**
     * The proleptic-month, which counts months sequentially
     * from year 0.
     *
     * The first month in year zero has the value zero. The value increase for later months
     * and decrease for earlier ones. Note that this uses the local time-line, ignoring offset
     * and time-zone.
     */
    PROLEPTIC_MONTH: ChronoField;
    /**
     * This counts the second within the day, from 0 to
     * (24 * 60 * 60) - 1.
     */
    SECOND_OF_DAY: ChronoField;
    /**
     * This counts the second within the minute, from 0 to 59.
     */
    SECOND_OF_MINUTE: ChronoField;
    /**
     * The proleptic year, such as 2012. This represents the concept of
     * the year, counting sequentially and using negative numbers. The proleptic year is not
     * interpreted in terms of the era.
     *
     * The standard mental model for a date is based on three concepts - year, month and day.
     * These map onto the `YEAR`, `MONTH_OF_YEAR` and `DAY_OF_MONTH` fields. Note that there is no
     * reference to eras. The full model for a date requires four concepts - era, year, month and
     * day. These map onto the `ERA`, `YEAR_OF_ERA`, `MONTH_OF_YEAR` and `DAY_OF_MONTH` fields.
     * Whether this field or `YEAR_OF_ERA` is used depends on which mental model is being used.
     */
    YEAR: ChronoField;
    /**
     * This represents the concept of the year within the era. This
     * field is typically used with `ERA`. The standard mental model for a date is based on three
     * concepts - year, month and day. These map onto the `YEAR`, `MONTH_OF_YEAR` and
     * `DAY_OF_MONTH` fields. Note that there is no reference to eras. The full model for a date
     * requires four concepts - era, year, month and day. These map onto the `ERA`, `YEAR_OF_ERA`,
     * `MONTH_OF_YEAR` and `DAY_OF_MONTH` fields. Whether this field or `YEAR` is used depends on
     * which mental model is being used.
     *
     * In the default ISO calendar system, there are two eras defined, 'BCE' and 'CE'.
     * The era 'CE' is the one currently in use and year-of-era runs from 1 to the maximum value.
     * The era 'BCE' is the previous era, and the year-of-era runs backwards.
     *
     * For example, subtracting a year each time yield the following:
     * - year-proleptic 2 = 'CE' year-of-era 2
     * - year-proleptic 1 = 'CE' year-of-era 1
     * - year-proleptic 0 = 'BCE' year-of-era 1
     * - year-proleptic -1 = 'BCE' year-of-era 2
     *
     * Note that the ISO-8601 standard does not actually define eras. Note also that the
     * ISO eras do not align with the well-known AD/BC eras due to the change between the Julian
     * and Gregorian calendar systems.
     */
    YEAR_OF_ERA: ChronoField;
}

export interface ChronoField extends TemporalField {
    isSupportedBy(temporal: TemporalAccessor): boolean;
    baseUnit(): TemporalUnit;
    /** Checks that the specified value is valid for this field. */
    checkValidValue(value: number): number;
    /**
     * Checks that the specified value is valid for this field and
     * is within the range of a safe integer.
     */
    checkValidIntValue(value: number): number;
    displayName(): string;
    equals(other: any): boolean;
    getFrom(temporal: TemporalAccessor): number;
    isDateBased(): boolean;
    isTimeBased(): boolean;
    name(): string;
    range(): ValueRange;
    rangeRefinedBy(temporal: TemporalAccessor): ValueRange;
    rangeUnit(): TemporalUnit;
    adjustInto<R extends Temporal>(temporal: R, newValue: number): R;
    toString(): string;
}

export const ChronoUnit: ChronoUnitConstructor

export interface ChronoUnitConstructor extends Prototype<ChronoUnit> {
    /**
     * Unit that represents the concept of a nanosecond, the smallest supported unit
     * of time. For the ISO calendar system, it is equal to the 1,000,000,000th part of the second unit.
     */
    NANOS: ChronoUnit;
    /**
     * Unit that represents the concept of a microsecond. For the ISO calendar
     * system, it is equal to the 1,000,000th part of the second unit.
     */
    MICROS: ChronoUnit;
    /**
     * Unit that represents the concept of a millisecond. For the ISO calendar
     * system, it is equal to the 1000th part of the second unit.
     */
    MILLIS: ChronoUnit;
    /**
     * Unit that represents the concept of a second. For the ISO calendar system,
     * it is equal to the second in the SI system of units, except around a leap-second.
     */
    SECONDS: ChronoUnit;
    /**
     * Unit that represents the concept of a minute. For the ISO calendar system,
     * it is equal to 60 seconds.
     */
    MINUTES: ChronoUnit;
    /**
     * Unit that represents the concept of an hour. For the ISO calendar system,
     * it is equal to 60 minutes.
     */
    HOURS: ChronoUnit;
    /**
     * Unit that represents the concept of half a day, as used in AM/PM. For
     * the ISO calendar system, it is equal to 12 hours.
     */
    HALF_DAYS: ChronoUnit;
    /**
     * Unit that represents the concept of a day. For the ISO calendar system, it
     * is the standard day from midnight to midnight. The estimated duration of a day is 24 Hours.
     */
    DAYS: ChronoUnit;
    /**
     * Unit that represents the concept of a week. For the ISO calendar system,
     * it is equal to 7 Days.
     */
    WEEKS: ChronoUnit;
    /**
     * Unit that represents the concept of a month. For the ISO calendar system,
     * the length of the month varies by month-of-year. The estimated duration of a month is
     * one twelfth of 365.2425 Days.
     */
    MONTHS: ChronoUnit;
    /**
     * Unit that represents the concept of a year. For the ISO calendar system, it
     * is equal to 12 months. The estimated duration of a year is 365.2425 Days.
     */
    YEARS: ChronoUnit;
    /**
     * Unit that represents the concept of a decade. For the ISO calendar system,
     * it is equal to 10 years.
     */
    DECADES: ChronoUnit;
    /**
     * Unit that represents the concept of a century. For the ISO calendar
     * system, it is equal to 100 years.
     */
    CENTURIES: ChronoUnit;
    /**
     * Unit that represents the concept of a millennium. For the ISO calendar
     * system, it is equal to 1,000 years.
     */
    MILLENNIA: ChronoUnit;
    /**
     * Unit that represents the concept of an era. The ISO calendar system doesn't
     * have eras thus it is impossible to add an era to a date or date-time. The estimated duration
     * of the era is artificially defined as 1,000,000,000 Years.
     */
    ERAS: ChronoUnit;
    /**
     * Artificial unit that represents the concept of forever. This is primarily
     * used with {@link TemporalField} to represent unbounded fields such as the year or era. The
     * estimated duration of the era is artificially defined as the largest duration supported by
     * {@link Duration}.
     */
    FOREVER: ChronoUnit;
}

/**
 * A standard set of date periods units.
 *
 * This set of units provide unit-based access to manipulate a date, time or date-time.
 * The standard set of units can be extended by implementing TemporalUnit.
 */
export interface ChronoUnit extends TemporalUnit, Comparable<ChronoUnit> {

    addTo<T extends Temporal>(temporal: T, amount: number): T;
    between(temporal1: Temporal, temporal2: Temporal): number;
    /**
     * Compares this ChronoUnit to the specified {@link TemporalUnit}.
     * The comparison is based on the total length of the durations.
     */
    compareTo(other: TemporalUnit): number;
    duration(): Duration;
    isDateBased(): boolean;
    isDurationEstimated(): boolean;
    isSupportedBy(temporal: Temporal): boolean;
    isTimeBased(): boolean;
    toString(): string;
}

/**
 * Fields and units specific to the ISO-8601 calendar system,
 * including quarter-of-year and week-based-year.
 */
export namespace IsoFields {
    /**
     * This field allows the day-of-quarter value to be queried and set. The day-of-quarter has
     * values from 1 to 90 in Q1 of a standard year, from 1 to 91 in Q1 of a leap year, from
     * 1 to 91 in Q2 and from 1 to 92 in Q3 and Q4.
     *
     * The day-of-quarter can only be calculated if the day-of-year, month-of-year and year are available.
     *
     * When setting this field, the value is allowed to be partially lenient, taking any value from
     * 1 to 92. If the quarter has less than 92 days, then day 92, and potentially day 91, is in
     * the following quarter.
     */
    export const DAY_OF_QUARTER: TemporalField;
    /**
     * This field allows the quarter-of-year value to be queried and set. The quarter-of-year has
     * values from 1 to 4.
     *
     * The day-of-quarter can only be calculated if the month-of-year is available.
     */
    export const QUARTER_OF_YEAR: TemporalField;
    /**
     * The field that represents the week-of-week-based-year.
     */
    export const WEEK_OF_WEEK_BASED_YEAR: TemporalField;
    /**
     * The field that represents the week-based-year.
     */
    export const WEEK_BASED_YEAR: TemporalField;
    /**
     * The unit that represents week-based-years for the purpose of addition and subtraction.
     *
     * This allows a number of week-based-years to be added to, or subtracted from, a date.
     * The unit is equal to either 52 or 53 weeks. The estimated duration of a week-based-year is
     * the same as that of a standard ISO year at 365.2425 Days.
     *
     * The rules for addition add the number of week-based-years to the existing value for the
     * week-based-year field. If the resulting week-based-year only has 52 weeks, then the date
     * will be in week 1 of the following week-based-year.
     */
    export const WEEK_BASED_YEARS: TemporalUnit;
    /**
     * Unit that represents the concept of a quarter-year. For the ISO calendar system, it is equal
     * to 3 months. The estimated duration of a quarter-year is one quarter of 365.2425 days.
     */
    export const QUARTER_YEARS: TemporalUnit;
}

export namespace TemporalAdjusters {
    /**
     * Returns the day-of-week in month adjuster, which returns a new date in the same month with
     * the ordinal day-of-week. This is used for expressions like the 'second Tuesday in March'.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-12-15 for (1,TUESDAY) will return 2011-12-06.
     * - The input 2011-12-15 for (2,TUESDAY) will return 2011-12-13.
     * - The input 2011-12-15 for (3,TUESDAY) will return 2011-12-20.
     * - The input 2011-12-15 for (4,TUESDAY) will return 2011-12-27.
     * - The input 2011-12-15 for (5,TUESDAY) will return 2012-01-03.
     * - The input 2011-12-15 for (-1,TUESDAY) will return 2011-12-27 (last in month).
     * - The input 2011-12-15 for (-4,TUESDAY) will return 2011-12-06 (3 weeks before last in month).
     * - The input 2011-12-15 for (-5,TUESDAY) will return 2011-11-29 (4 weeks before last in month).
     * - The input 2011-12-15 for (0,TUESDAY) will return 2011-11-29 (last in previous month).
     *
     * For a positive or zero ordinal, the algorithm is equivalent to finding the first day-of-week
     * that matches within the month and then adding a number of weeks to it. For a negative
     * ordinal, the algorithm is equivalent to finding the last day-of-week that matches within the
     * month and then subtracting a number of weeks to it. The ordinal number of weeks is not
     * validated and is interpreted leniently according to this algorithm. This definition means
     * that an ordinal of zero finds the last matching day-of-week in the previous month.
     *
     * The behavior is suitable for use with most calendar systems. It uses the `DAY_OF_WEEK`
     * and `DAY_OF_MONTH` fields and the `DAYS` unit, and assumes a seven day week.
     */
    function dayOfWeekInMonth(ordinal: number, dayOfWeek: DayOfWeek): TemporalAdjuster;
    /**
     * Returns the "first day of month" adjuster, which returns a new date set to the first day
     * of the current month.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 will return 2011-01-01.
     * - The input 2011-02-15 will return 2011-02-01.
     *
     * The behavior is suitable for use with most calendar systems. It is equivalent to:
     * ```
     * temporal.with(DAY_OF_MONTH, 1);
     * ```
     */
    function firstDayOfMonth(): TemporalAdjuster;
    /**
     * Returns the "first day of next month" adjuster, which returns a new date set to the first
     * day of the next month.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 will return 2011-02-01.
     * - The input 2011-02-15 will return 2011-03-01.
     *
     * The behavior is suitable for use with most calendar systems. It is equivalent to:
     * ```
     * temporal.with(DAY_OF_MONTH, 1).plus(1, MONTHS);
     * ```
     */
    function firstDayOfNextMonth(): TemporalAdjuster;
    /**
     * Returns the "first day of next year" adjuster, which returns a new date set to the first
     * day of the next year.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 will return 2012-01-01.
     *
     * The behavior is suitable for use with most calendar systems. It is equivalent to:
     * ```
     * temporal.with(DAY_OF_YEAR, 1).plus(1, YEARS);
     * ```
     */
    function firstDayOfNextYear(): TemporalAdjuster;
    /**
     * Returns the "first day of year" adjuster, which returns a new date set to the first day
     * of the current year.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 will return 2011-01-01.
     * - The input 2011-02-15 will return 2011-01-01.
     *
     * The behavior is suitable for use with most calendar systems. It is equivalent to:
     * ```
     * temporal.with(DAY_OF_YEAR, 1);
     * ```
     */
    function firstDayOfYear(): TemporalAdjuster;
    /**
     * Returns the first in month adjuster, which returns a new date in the same month with the
     * first matching day-of-week. This is used for expressions like 'first Tuesday in March'.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-12-15 for (MONDAY) will return 2011-12-05.
     * - The input 2011-12-15 for (FRIDAY) will return 2011-12-02.
     *
     * The behavior is suitable for use with most calendar systems. It uses the `DAY_OF_WEEK`
     * and `DAY_OF_MONTH` fields and the `DAYS` unit, and assumes a seven day week.
     */
    function firstInMonth(dayOfWeek: DayOfWeek): TemporalAdjuster;
    /**
     * Returns the "last day of month" adjuster, which returns a new date set to the last day of
     * the current month.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 will return 2011-01-31.
     * - The input 2011-02-15 will return 2011-02-28.
     * - The input 2012-02-15 will return 2012-02-29 (leap year).
     * - The input 2011-04-15 will return 2011-04-30.
     *
     * The behavior is suitable for use with most calendar systems. It is equivalent to:
     * ```
     * const lastDay = temporal.range(DAY_OF_MONTH).getMaximum();
     * temporal.with(DAY_OF_MONTH, lastDay);
     * ```
     */
    function lastDayOfMonth(): TemporalAdjuster;
    /**
     * Returns the "last day of year" adjuster, which returns a new date set to the last day of
     * the current year.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 will return 2011-12-31.
     * - The input 2011-02-15 will return 2011-12-31.
     *
     * The behavior is suitable for use with most calendar systems. It is equivalent to:
     * ```
     * const lastDay = temporal.range(DAY_OF_YEAR).getMaximum();
     * temporal.with(DAY_OF_YEAR, lastDay);
     * ```
     */
    function lastDayOfYear(): TemporalAdjuster;
    /**
     * Returns the last in month adjuster, which returns a new date in the same month with the
     * last matching day-of-week. This is used for expressions like 'last Tuesday in March'.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-12-15 for (MONDAY) will return 2011-12-26.
     * - The input 2011-12-15 for (FRIDAY) will return 2011-12-30.
     *
     * The behavior is suitable for use with most calendar systems. It uses the `DAY_OF_WEEK`
     * and `DAY_OF_MONTH` fields and the `DAYS` unit, and assumes a seven day week.
     */
    function lastInMonth(dayOfWeek: DayOfWeek): TemporalAdjuster;
    /**
     * Returns the next day-of-week adjuster, which adjusts the date to the first occurrence of
     * the specified day-of-week after the date being adjusted.
     *
     * - The ISO calendar system behaves as follows:
     * - The input 2011-01-15 (a Saturday) for parameter (MONDAY) will return 2011-01-17 (two
     * days later).
     * - The input 2011-01-15 (a Saturday) for parameter (WEDNESDAY) will return 2011-01-19 (four
     * days later).
     * - The input 2011-01-15 (a Saturday) for parameter (SATURDAY) will return 2011-01-22 (seven
     * days later).
     *
     * The behavior is suitable for use with most calendar systems. It uses the `DAY_OF_WEEK`
     * field and the `DAYS` unit, and assumes a seven day week.
     */
    function next(dayOfWeek: DayOfWeek): TemporalAdjuster;
    /**
     * Returns the next-or-same day-of-week adjuster, which adjusts the date to the first
     * occurrence of the specified day-of-week after the date being adjusted unless it is already
     * on that day in which case the same object is returned.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 (a Saturday) for parameter (MONDAY) will return 2011-01-17 (two
     * days later).
     * - The input 2011-01-15 (a Saturday) for parameter (WEDNESDAY) will return 2011-01-19 (four
     * days later).
     * - The input 2011-01-15 (a Saturday) for parameter (SATURDAY) will return 2011-01-15 (same
     * as input).
     *
     * The behavior is suitable for use with most calendar systems. It uses the `DAY_OF_WEEK`
     * field and the `DAYS` unit, and assumes a seven day week.
     */
    function nextOrSame(dayOfWeek: DayOfWeek): TemporalAdjuster;
    /**
     * Returns the previous day-of-week adjuster, which adjusts the date to the first occurrence
     * of the specified day-of-week before the date being adjusted.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 (a Saturday) for parameter (MONDAY) will return 2011-01-10 (five
     * days earlier).
     * - The input 2011-01-15 (a Saturday) for parameter (WEDNESDAY) will return 2011-01-12 (three
     * days earlier).
     * - The input 2011-01-15 (a Saturday) for parameter (SATURDAY) will return 2011-01-08 (seven
     * days earlier).
     *
     * The behavior is suitable for use with most calendar systems. It uses the `DAY_OF_WEEK` field
     * and the `DAYS` unit, and assumes a seven day week.
     */
    function previous(dayOfWeek: DayOfWeek): TemporalAdjuster;
    /**
     * Returns the previous-or-same day-of-week adjuster, which adjusts the date to the first
     * occurrence of the specified day-of-week before the date being adjusted unless it is already
     * on that day in which case the same object is returned.
     *
     * The ISO calendar system behaves as follows:
     * - The input 2011-01-15 (a Saturday) for parameter (MONDAY) will return 2011-01-10 (five
     * days earlier).
     * - The input 2011-01-15 (a Saturday) for parameter (WEDNESDAY) will return 2011-01-12 (three
     * days earlier).
     * - The input 2011-01-15 (a Saturday) for parameter (SATURDAY) will return 2011-01-15 (same
     * as input).
     *
     * The behavior is suitable for use with most calendar systems. It uses the `DAY_OF_WEEK`
     * field and the `DAYS` unit, and assumes a seven day week.
     */
    function previousOrSame(dayOfWeek: DayOfWeek): TemporalAdjuster;
}

export namespace TemporalQueries {
    function chronology(): TemporalQuery<Chronology | null>;
    function localDate(): TemporalQuery<LocalDate | null>;
    function localTime(): TemporalQuery<LocalTime | null>;
    function offset(): TemporalQuery<ZoneOffset | null>;
    function precision(): TemporalQuery<TemporalUnit | null>;
    function zone(): TemporalQuery<ZoneId | null>;
    function zoneId(): TemporalQuery<ZoneId | null>;
}

// ----------------------------------------------------------------------------
//   MAIN
// ----------------------------------------------------------------------------

export const Clock: ClockConstructor

export interface ClockConstructor extends Prototype<Clock> {
    fixed(fixedInstant: Instant, zoneId: ZoneId): Clock;
    offset(baseClock: Clock, offsetDuration: Duration): Clock;
    system(zone: ZoneId): Clock;
    systemDefaultZone(): Clock;
    systemUTC(): Clock;
}

export interface Clock {
    equals(other: any): boolean;
    instant(): Instant;
    millis(): number;
    withZone(zone: ZoneId): Clock;
    zone(): ZoneId;
}

export const Duration: DurationConstructor

export interface DurationConstructor extends Prototype<Duration> {
    ZERO: Duration;

    between(startInclusive: Temporal, endExclusive: Temporal): Duration;
    from(amount: TemporalAmount): Duration;
    of(amount: number, unit: TemporalUnit): Duration;
    ofDays(days: number): Duration;
    ofHours(hours: number): Duration;
    ofMillis(millis: number): Duration;
    ofMinutes(minutes: number): Duration;
    ofNanos(nanos: number): Duration;
    ofSeconds(seconds: number, nanoAdjustment?: number): Duration;
    parse(text: string): Duration;
}

export interface Duration extends TemporalAmount, Comparable<Duration> {
    abs(): Duration;
    addTo<T extends Temporal>(temporal: T): T;
    dividedBy(divisor: number): Duration;
    get(unit: TemporalUnit): number;
    isNegative(): boolean;
    isZero(): boolean;
    minus(amount: number, unit: TemporalUnit): Duration;
    minus(duration: Duration): Duration;
    minusDays(daysToSubtract: number): Duration;
    minusHours(hoursToSubtract: number): Duration;
    minusMillis(millisToSubtract: number): Duration;
    minusMinutes(minutesToSubtract: number): Duration;
    minusNanos(nanosToSubtract: number): Duration;
    minusSeconds(secondsToSubtract: number): Duration;
    multipliedBy(multiplicand: number): Duration;
    nano(): number;
    negated(): Duration;
    plus(amount: number, unit: TemporalUnit): Duration;
    plus(duration: Duration): Duration;
    plusDays(daysToAdd: number): Duration;
    plusHours(hoursToAdd: number): Duration;
    plusMillis(millisToAdd: number): Duration;
    plusMinutes(minutesToAdd: number): Duration;
    plusNanos(nanosToAdd: number): Duration;
    plusSeconds(secondsToAdd: number): Duration;
    plusSecondsNanos(secondsToAdd: number, nanosToAdd: number): Duration;
    seconds(): number;
    subtractFrom<T extends Temporal>(temporal: T): T;
    toDays(): number;
    toHours(): number;
    toJSON(): string;
    toMillis(): number;
    toMinutes(): number;
    toNanos(): number;
    toString(): string;
    units(): TemporalUnit[];
    withNanos(nanoOfSecond: number): Duration;
    withSeconds(seconds: number): Duration;
}

export const Instant: InstantConstructor

export interface InstantConstructor extends Prototype<Instant> {
    EPOCH: Instant;
    MIN: Instant;
    MAX: Instant;
    MIN_SECONDS: Instant;
    MAX_SECONDS: Instant;

    FROM: TemporalQuery<Instant>;

    from(temporal: TemporalAccessor): Instant;
    now(clock?: Clock): Instant;
    ofEpochMilli(epochMilli: number): Instant;
    ofEpochSecond(epochSecond: number): Instant;
    parse(text: string): Instant;
}

export interface Instant extends Temporal, TemporalAdjuster, ComparableEx<Instant> {
    adjustInto(temporal: Temporal): Temporal;
    atOffset(offset: ZoneOffset): OffsetDateTime;
    atZone(zone: ZoneId): ZonedDateTime;
    epochSecond(): number;
    getLong(field: TemporalField): number;
    hashCode(): number;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    minus(amountToSubtract: number, unit: TemporalUnit): Instant;
    minus(amount: TemporalAmount): Instant;
    minusMillis(millisToSubtract: number): Instant;
    minusNanos(nanosToSubtract: number): Instant;
    minusSeconds(secondsToSubtract: number): Instant;
    nano(): number;
    plus(amountToAdd: number, unit: TemporalUnit): Instant;
    plus(amount: TemporalAmount): Instant;
    plusMillis(millisToAdd: number): Instant;
    plusNanos(nanosToAdd: number): Instant;
    plusSeconds(secondsToAdd: number): Instant;
    toEpochMilli(): number;
    toJSON(): string;
    toString(): string;
    truncatedTo(unit: TemporalUnit): Instant;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): Instant;
    with(field: TemporalField, newValue: number): Instant;
}

interface OfEpochSecond<T> {
    ofEpochSecond(epochSecond: number, zoneId: ZoneId): T
}

export const LocalDate: LocalDateConstructor

export interface LocalDateConstructor extends Prototype<LocalDate>, OfEpochSecond<LocalDate> {
    MIN: LocalDate;
    MAX: LocalDate;
    EPOCH_0: LocalDate;

    FROM: TemporalQuery<LocalDate>;

    from(temporal: TemporalAccessor): LocalDate;
    now(clockOrZone: Clock | ZoneId): LocalDate;
    of(year: number, month: Month | number, dayOfMonth: number): LocalDate;
    ofEpochDay(epochDay: number): LocalDate;
    ofInstant(instant: Instant, zoneId: ZoneId): LocalDate;
    ofYearDay(year: number, dayOfYear: number): LocalDate;
    parse(text: string, formatter?: DateTimeFormatter): LocalDate;
}

export interface Comparable<T> {
    compareTo(other: T): number;
    isEqual(other: T): boolean;
}

export interface ComparableEx<T> extends Comparable<T> {
    isAfter(other: T): boolean;
    isBefore(other: T): boolean;
    isEqualOrAfter(other: T): boolean;
    isEqualOrBefore(other: T): boolean;
}

export function maxOf<T extends Comparable<T>>(...args: T[]): T;
export function minOf<T extends Comparable<T>>(...args: T[]): T;

export interface LocalDate extends ChronoLocalDate, TemporalAdjuster, ComparableEx<LocalDate> {
    atStartOfDay(): LocalDateTime;
    atStartOfDay(zone: ZoneId): ZonedDateTime;
    atTime(hour: number, minute: number, second?: number, nanoOfSecond?: number): LocalDateTime;
    atTime(time: LocalTime): LocalDateTime;
    atTime(time: OffsetTime): OffsetDateTime;
    chronology(): Chronology;
    dayOfMonth(): number;
    dayOfWeek(): DayOfWeek;
    dayOfYear(): number;
    equals(other: any): boolean;
    getLong(field: TemporalField): number;
    hashCode(): number;
    isLeapYear(): boolean;
    isoWeekOfWeekyear(): number;
    isoWeekyear(): number;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    lengthOfMonth(): number;
    lengthOfYear(): number;
    minus(amountToSubtract: number, unit: TemporalUnit): LocalDate;
    minus(amount: TemporalAmount): LocalDate;
    minusDays(daysToSubtract: number): LocalDate;
    minusMonths(monthsToSubtract: number): LocalDate;
    minusWeeks(weeksToSubtract: number): LocalDate;
    minusYears(yearsToSubtract: number): LocalDate;
    month(): Month;
    monthValue(): number;
    plus(amountToAdd: number, unit: TemporalUnit): LocalDate;
    plus(amount: TemporalAmount): LocalDate;
    plusDays(daysToAdd: number): LocalDate;
    plusMonths(monthsToAdd: number): LocalDate;
    plusWeeks(weeksToAdd: number): LocalDate;
    plusYears(yearsToAdd: number): LocalDate;
    toEpochDay(): number;
    toJSON(): string;
    toString(): string;
    until(endDate: TemporalAccessor): Period;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): LocalDate;
    with(field: TemporalField, newValue: number): LocalDate;
    withDayOfMonth(dayOfMonth: number): LocalDate;
    withDayOfYear(dayOfYear: number): LocalDate;
    withMonth(month: Month | number): LocalDate;
    withYear(year: number): LocalDate;
    year(): number;
}

export const LocalDateTime: LocalDateTimeConstructor

export interface LocalDateTimeConstructor extends Prototype<LocalDateTime>, OfEpochSecond<LocalDateTime> {
    MIN: LocalDateTime;
    MAX: LocalDateTime;

    FROM: TemporalQuery<LocalDateTime>;

    from(temporal: TemporalAccessor): LocalDateTime;
    now(clockOrZone: Clock | ZoneId): LocalDateTime;
    of(date: LocalDate, time: LocalTime): LocalDateTime;
    of(year: number, month: Month | number, dayOfMonth: number, hour?: number, minute?: number, second?: number, nanoSecond?: number): LocalDateTime;
    ofInstant(instant: Instant, zoneId: ZoneId): LocalDateTime;
    parse(text: string, formatter?: DateTimeFormatter): LocalDateTime;
}

export interface LocalDateTime extends ChronoLocalDateTime, TemporalAdjuster, ComparableEx<LocalDateTime> {
    atOffset(offset: ZoneOffset): OffsetDateTime;
    atZone(zone: ZoneId): ZonedDateTime;
    dayOfMonth(): number;
    dayOfWeek(): DayOfWeek;
    dayOfYear(): number;
    equals(other: any): boolean;
    format(formatter: DateTimeFormatter): string;
    getLong(field: TemporalField): number;
    hashCode(): number;
    hour(): number;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    minus(amountToSubtract: number, unit: TemporalUnit): LocalDateTime;
    minus(amount: TemporalAmount): LocalDateTime;
    minusDays(days: number): LocalDateTime;
    minusHours(hours: number): LocalDateTime;
    minusMinutes(minutes: number): LocalDateTime;
    minusMonths(months: number): LocalDateTime;
    minusNanos(nanos: number): LocalDateTime;
    minusSeconds(seconds: number): LocalDateTime;
    minusWeeks(weeks: number): LocalDateTime;
    minusYears(years: number): LocalDateTime;
    minute(): number;
    month(): Month;
    monthValue(): number;
    nano(): number;
    plus(amountToAdd: number, unit: TemporalUnit): LocalDateTime;
    plus(amount: TemporalAmount): LocalDateTime;
    plusDays(days: number): LocalDateTime;
    plusHours(hours: number): LocalDateTime;
    plusMinutes(minutes: number): LocalDateTime;
    plusMonths(months: number): LocalDateTime;
    plusNanos(nanos: number): LocalDateTime;
    plusSeconds(seconds: number): LocalDateTime;
    plusWeeks(weeks: number): LocalDateTime;
    plusYears(years: number): LocalDateTime;
    second(): number;
    toJSON(): string;
    toLocalDate(): LocalDate;
    toLocalTime(): LocalTime;
    toString(): string;
    truncatedTo(unit: TemporalUnit): LocalDateTime;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): LocalDateTime;
    with(field: TemporalField, newValue: number): LocalDateTime;
    withDayOfMonth(dayOfMonth: number): LocalDateTime;
    withDayOfYear(dayOfYear: number): LocalDateTime;
    withHour(hour: number): LocalDateTime;
    withMinute(minute: number): LocalDateTime;
    withMonth(month: number | Month): LocalDateTime;
    withNano(nanoOfSecond: number): LocalDateTime;
    withSecond(second: number): LocalDateTime;
    withYear(year: number): LocalDateTime;
    year(): number;
}

export const LocalTime: LocalTimeConstructor

export interface LocalTimeConstructor extends Prototype<LocalTime>, OfEpochSecond<LocalTime> {
    MIN: LocalTime;
    MAX: LocalTime;
    MIDNIGHT: LocalTime;
    NOON: LocalTime;
    HOURS_PER_DAY: number;
    MINUTES_PER_HOUR: number;
    MINUTES_PER_DAY: number;
    SECONDS_PER_MINUTE: number;
    SECONDS_PER_HOUR: number;
    SECONDS_PER_DAY: number;
    MILLIS_PER_DAY: number;
    MICROS_PER_DAY: number;
    NANOS_PER_SECOND: number;
    NANOS_PER_MINUTE: number;
    NANOS_PER_HOUR: number;
    NANOS_PER_DAY: number;

    FROM: TemporalQuery<LocalTime>;

    from(temporal: TemporalAccessor): LocalTime;
    now(clockOrZone: Clock | ZoneId): LocalTime;
    of(hour?: number, minute?: number, second?: number, nanoOfSecond?: number): LocalTime;
    ofInstant(instant: Instant, zone: ZoneId): LocalTime;
    ofNanoOfDay(nanoOfDay: number): LocalTime;
    ofSecondOfDay(secondOfDay?: number, nanoOfSecond?: number): LocalTime;
    parse(text: String, formatter?: DateTimeFormatter): LocalTime;
}

export interface LocalTime extends Temporal, TemporalAdjuster, ComparableEx<LocalTime> {
    adjustInto(temporal: Temporal): Temporal;
    atDate(date: LocalDate): LocalDateTime;
    atOffset(offset: ZoneOffset): OffsetTime;
    format(formatter: DateTimeFormatter): string;
    getLong(field: ChronoField): number;
    hashCode(): number;
    hour(): number;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    minus(amountToSubtract: number, unit: TemporalUnit): LocalTime;
    minus(amount: TemporalAmount): LocalTime;
    minusHours(hoursToSubtract: number): LocalTime;
    minusMinutes(minutesToSubtract: number): LocalTime;
    minusNanos(nanosToSubtract: number): LocalTime;
    minusSeconds(secondsToSubtract: number): LocalTime;
    minute(): number;
    nano(): number;
    plus(amountToAdd: number, unit: TemporalUnit): LocalTime;
    plus(amount: TemporalAmount): LocalTime;
    plusHours(hoursToAdd: number): LocalTime;
    plusMinutes(minutesToAdd: number): LocalTime;
    plusNanos(nanosToAdd: number): LocalTime;
    plusSeconds(secondstoAdd: number): LocalTime;
    second(): number;
    toJSON(): string;
    toNanoOfDay(): number;
    toSecondOfDay(): number;
    toString(): string;
    toString(): string;
    truncatedTo(unit: ChronoUnit): LocalTime;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): LocalTime;
    with(field: TemporalField, newValue: number): LocalTime;
    withHour(hour: number): LocalTime;
    withMinute(minute: number): LocalTime;
    withNano(nanoOfSecond: number): LocalTime;
    withSecond(second: number): LocalTime;
}

export const MonthDay: MonthDayConstructor

export interface MonthDayConstructor extends Prototype<MonthDay> {
    FROM: TemporalQuery<MonthDay>;

    from(temporal: TemporalAccessor): MonthDay;
    now(zoneIdOrClock: ZoneId | Clock): MonthDay;
    of(month: Month | number, dayOfMonth: number): MonthDay;
    parse(text: string, formatter?: DateTimeFormatter): MonthDay;
}

export interface MonthDay extends TemporalAccessor, TemporalAdjuster, ComparableEx<MonthDay> {
    adjustInto(temporal: Temporal): Temporal;
    atYear(year: number): LocalDate;
    dayOfMonth(): number;
    format(formatter: DateTimeFormatter): string;
    getLong(field: TemporalField): number;
    isSupported(field: TemporalField): boolean;
    isValidYear(year: number): boolean;
    month(): Month;
    monthValue(): number;
    toJSON(): string;
    toString(): string;
    with(month: Month): MonthDay;
    withDayOfMonth(dayOfMonth: number): MonthDay;
    withMonth(month: number): MonthDay;
}

export const Period: PeriodConstructor

export interface PeriodConstructor extends Prototype<Period> {
    ZERO: Period;

    between(startDate: LocalDate, endDate: LocalDate): Period;
    from(amount: TemporalAmount): Period;
    of(years: number, months: number, days: number): Period;
    ofDays(days: number): Period;
    ofMonths(months: number): Period;
    ofWeeks(weeks: number): Period;
    ofYears(years: number): Period;
    parse(text: string): Period;
}

export interface Period extends TemporalAmount {
    addTo<T extends Temporal>(temporal: T): T;
    chronology(): IsoChronology;
    days(): number;
    equals(other: any): boolean;
    get(unit: TemporalUnit): number;
    hashCode(): number;
    isNegative(): boolean;
    isZero(): boolean;
    minus(amountToSubtract: TemporalAmount): Period;
    minusDays(daysToSubtract: number): Period;
    minusMonths(monthsToSubtract: number): Period;
    minusYears(yearsToSubtract: number): Period;
    months(): number;
    multipliedBy(scalar: number): Period;
    negated(): Period;
    normalized(): Period;
    plus(amountToAdd: TemporalAmount): Period;
    plusDays(daysToAdd: number): Period;
    plusMonths(monthsToAdd: number): Period;
    plusYears(yearsToAdd: number): Period;
    subtractFrom<T extends Temporal>(temporal: T): T;
    toJSON(): string;
    toString(): string;
    toTotalMonths(): number;
    units(): TemporalUnit[];
    withDays(days: number): Period;
    withMonths(months: number): Period;
    withYears(years: number): Period;
    years(): number;
}

export const Year: YearConstructor

export interface YearConstructor extends Prototype<Year> {
    MIN_VALUE: number;
    MAX_VALUE: number;

    FROM: TemporalQuery<Year>;

    from(temporal: TemporalAccessor): Year;
    isLeap(year: number): boolean;
    now(zoneIdOrClock: ZoneId | Clock): Year;
    of(isoYear: number): Year;
    parse(text: string, formatter?: DateTimeFormatter): Year;
}

export interface Year extends Temporal, TemporalAdjuster, ComparableEx<Year> {
    adjustInto(temporal: Temporal): Temporal;
    atDay(dayOfYear: number): LocalDate;
    atMonth(month: Month | number): YearMonth;
    atMonthDay(monthDay: MonthDay): LocalDate;
    getLong(field: TemporalField): number;
    isLeap(): boolean;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    isValidMonthDay(monthDay: MonthDay): boolean;
    length(): number;
    minus(amountToSubtract: number, unit: TemporalUnit): Year;
    minus(amount: TemporalAmount): Year;
    minusYears(yearsToSubtract: number): Year;
    plus(amountToAdd: number, unit: TemporalUnit): Year;
    plus(amount: TemporalAmount): Year;
    plusYears(yearsToAdd: number): Year;
    toJSON(): string;
    toString(): string;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    value(): number;
    with(adjuster: TemporalAdjuster): Year;
    with(field: TemporalField, newValue: number): Year;
}

export const YearMonth: YearMonthConstructor

export interface YearMonthConstructor extends Prototype<YearMonth> {
    FROM: TemporalQuery<YearMonth>;

    from(temporal: TemporalAccessor): YearMonth;
    now(zoneIdOrClock: ZoneId | Clock): YearMonth;
    of(year: number, monthOrNumber: Month | number): YearMonth;
    parse(text: string, formatter?: DateTimeFormatter): YearMonth;
}

export interface YearMonth extends Temporal, TemporalAdjuster, ComparableEx<YearMonth> {
    adjustInto(temporal: Temporal): Temporal;
    atDay(dayOfMonth: number): LocalDate;
    atEndOfMonth(): LocalDate;
    equals(other: any): boolean;
    format(formatter: DateTimeFormatter): string;
    getLong(field: TemporalField): number;
    isLeapYear(): boolean;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    isValidDay(): boolean;
    lengthOfMonth(): number;
    lengthOfYear(): number;
    minus(amountToSubtract: number, unit: TemporalUnit): YearMonth;
    minus(amount: TemporalAmount): YearMonth;
    minusMonths(monthsToSubtract: number): YearMonth;
    minusYears(yearsToSubtract: number): YearMonth;
    month(): Month;
    monthValue(): number;
    plus(amountToAdd: number, unit: TemporalUnit): YearMonth;
    plus(amount: TemporalAmount): YearMonth;
    plusMonths(monthsToAdd: number): YearMonth;
    plusYears(yearsToAdd: number): YearMonth;
    toJSON(): string;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): YearMonth;
    with(field: TemporalField, newValue: number): YearMonth;
    withMonth(month: number): YearMonth;
    withYear(year: number): YearMonth;
    year(): number;
}

/**
 * A date-time with an offset from UTC/Greenwich in the ISO-8601 calendar system, such as
 * `2007-12-03T10:15:30+01:00`.
 *
 * `OffsetDateTime` is an immutable representation of a date-time with an offset. This class stores
 * all date and time fields, to a precision of nanoseconds, as well as the offset from
 * UTC/Greenwich. For example, the value "2nd October 2007 at 13:45:30.123456789 +02:00" can be
 * stored in an `OffsetDateTime`.
 *
 * `OffsetDateTime`, `ZonedDateTime` and `Instant` all store an instant on the time-line to
 * nanosecond precision. `Instant` is the simplest, simply representing the instant. `OffsetDateTime`
 * adds to the instant the offset from UTC/Greenwich, which allows the local date-time to be obtained.
 * `ZonedDateTime` adds full time-zone rules.
 *
 * It is intended that `ZonedDateTime` or `Instant` is used to model data in simpler applications. This
 * class may be used when modeling date-time concepts in more detail, or when communicating to a
 * database or in a network protocol.
 *
 * This is a value-based class; use of identity-sensitive operations (including reference equality
 * (`==`), identity hash code, or synchronization) on instances of `OffsetDateTime` may have
 * unpredictable results and should be avoided. The `equals` method should be used for comparisons.
 */
export const OffsetDateTime: OffsetDateTimeConstructor

export interface OffsetDateTimeConstructor extends Prototype<OffsetDateTime> {
    MIN: OffsetDateTime;
    MAX: OffsetDateTime;
    FROM: TemporalQuery<OffsetDateTime>;

    from(temporal: TemporalAccessor): OffsetDateTime
    now(clockOrZone: Clock | ZoneId): OffsetDateTime;
    of(dateTime: LocalDateTime, offset: ZoneOffset): OffsetDateTime;
    of(date: LocalDate, time: LocalTime, offset: ZoneOffset): OffsetDateTime;
    of(year: number, month: number, day: number, hour: number, minute: number, second: number, nanoOfSecond: number, offset: ZoneOffset): OffsetDateTime;
    ofInstant(instant: Instant, zone: ZoneId): OffsetDateTime;
    parse(text: string, formatter?: DateTimeFormatter): OffsetDateTime;
}

export interface OffsetDateTime extends Temporal, TemporalAdjuster, ComparableEx<OffsetDateTime> {
    adjustInto(temporal: Temporal): Temporal;
    atZoneSameInstant(zone: ZoneId): ZonedDateTime;
    atZoneSimilarLocal(zone: ZoneId): ZonedDateTime;
    dayOfMonth(): number;
    dayOfWeek(): DayOfWeek;
    dayOfYear(): number;
    equals(other: any): boolean;
    format(formatter: DateTimeFormatter): string;
    getLong(field: TemporalField): number;
    hashCode(): number;
    hour(): number;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    minus(amountToSubtract: number, unit: TemporalUnit): OffsetDateTime;
    minus(amount: TemporalAmount): OffsetDateTime;
    minusDays(days: number): OffsetDateTime;
    minusHours(hours: number): OffsetDateTime;
    minusMinutes(minutes: number): OffsetDateTime;
    minusMonths(months: number): OffsetDateTime;
    minusNanos(nanos: number): OffsetDateTime;
    minusSeconds(seconds: number): OffsetDateTime;
    minusWeeks(weeks: number): OffsetDateTime;
    minusYears(years: number): OffsetDateTime;
    minute(): number;
    month(): Month;
    monthValue(): number;
    nano(): number;
    offset(): ZoneOffset;
    plus(amountToAdd: number, unit: TemporalUnit): OffsetDateTime;
    plus(amount: TemporalAmount): OffsetDateTime;
    plusDays(days: number): OffsetDateTime;
    plusHours(hours: number): OffsetDateTime;
    plusMinutes(minutes: number): OffsetDateTime;
    plusMonths(months: number): OffsetDateTime;
    plusNanos(nanos: number): OffsetDateTime;
    plusSeconds(seconds: number): OffsetDateTime;
    plusWeeks(weeks: number): OffsetDateTime;
    plusYears(years: number): OffsetDateTime;
    second(): number;
    toEpochSecond(): number;
    toInstant(): Instant;
    toJSON(): string;
    toLocalDate(): LocalDate;
    toLocalDateTime(): LocalDateTime;
    toLocalTime(): LocalTime;
    toOffsetTime(): OffsetTime;
    toString(): string;
    truncatedTo(unit: TemporalUnit): OffsetDateTime;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): OffsetDateTime;
    with(field: TemporalField, newValue: number): OffsetDateTime;
    withDayOfMonth(dayOfMonth: number): OffsetDateTime;
    withDayOfYear(dayOfYear: number): OffsetDateTime;
    withHour(hour: number): OffsetDateTime;
    withMinute(minute: number): OffsetDateTime;
    withMonth(month: number): OffsetDateTime;
    withNano(nanoOfSecond: number): OffsetDateTime;
    withOffsetSameInstant(offset: ZoneOffset): OffsetDateTime;
    withOffsetSameLocal(offset: ZoneOffset): OffsetDateTime;
    withSecond(second: number): OffsetDateTime;
    withYear(year: number): OffsetDateTime;
    year(): number;
}

/**
 * A time with an offset from UTC/Greenwich in the ISO-8601 calendar system, such as `10:15:30+01:00`.
 *
 * `OffsetTime` is an immutable date-time object that represents a time, often viewed as
 * hour-minute-second-offset. This class stores all time fields, to a precision of nanoseconds, as
 * well as a zone offset. For example, the value "13:45:30.123456789+02:00" can be stored in an
 * `OffsetTime`.
 *
 * This is a value-based class; use of identity-sensitive operations (including reference equality
 * (`==`), identity hash code, or synchronization) on instances of `OffsetTime` may have
 * unpredictable results and should be avoided. The `equals` method should be used for comparisons.
 */
export const OffsetTime: OffsetTimeConstructor

export interface OffsetTimeConstructor extends Prototype<OffsetTime> {
    MIN: OffsetTime;
    MAX: OffsetTime;
    FROM: TemporalQuery<OffsetTime>;

    from(temporal: TemporalAccessor): OffsetTime
    now(clockOrZone: Clock | ZoneId): OffsetTime;
    of(time: LocalTime, offset: ZoneOffset): OffsetTime;
    of(hour: number, minute: number, second: number, nanoOfSecond: number, offset: ZoneOffset): OffsetTime;
    ofInstant(instant: Instant, zone: ZoneId): OffsetTime;
    parse(text: string, formatter?: DateTimeFormatter): OffsetTime;
}

export interface OffsetTime extends Temporal, TemporalAdjuster, ComparableEx<OffsetTime> {
    adjustInto(temporal: Temporal): Temporal;
    atDate(date: LocalDate): OffsetDateTime;
    format(formatter: DateTimeFormatter): string;
    getLong(field: TemporalField): number;
    hashCode(): number;
    hour(): number;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    minus(amountToSubtract: number, unit: TemporalUnit): OffsetTime;
    minus(amount: TemporalAmount): OffsetTime;
    minusHours(hours: number): OffsetTime;
    minusMinutes(minutes: number): OffsetTime;
    minusNanos(nanos: number): OffsetTime;
    minusSeconds(seconds: number): OffsetTime;
    minute(): number;
    nano(): number;
    offset(): ZoneOffset;
    plus(amountToAdd: number, unit: TemporalUnit): OffsetTime;
    plus(amount: TemporalAmount): OffsetTime;
    plusHours(hours: number): OffsetTime;
    plusMinutes(minutes: number): OffsetTime;
    plusNanos(nanos: number): OffsetTime;
    plusSeconds(seconds: number): OffsetTime;
    second(): number;
    toEpochSecond(date: LocalDate): number;
    toJSON(): string;
    toLocalTime(): LocalTime;
    toString(): string;
    truncatedTo(unit: TemporalUnit): OffsetTime;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): OffsetTime;
    with(field: TemporalField, newValue: number): OffsetTime;
    withHour(hour: number): OffsetTime;
    withMinute(minute: number): OffsetTime;
    withNano(nanoOfSecond: number): OffsetTime;
    withOffsetSameInstant(offset: ZoneOffset): OffsetTime;
    withOffsetSameLocal(offset: ZoneOffset): OffsetTime;
    withSecond(second: number): OffsetTime;
}

/**
 * A date-time with a time-zone in the ISO-8601 calendar system, such as
 * `2007-12-23T10:15:30+01:00 Europe/Paris`.
 *
 * `ZonedDateTime` is an immutable representation of a date-time with a time-zone. This class
 * stores all date and time fields, to a precision of nanoseconds, and a time-zone, with a zone
 * offset used to handle ambiguous local date-times. For example, the value "2nd October 2007 at
 * 13:45.30.123456789 +02:00 in the Europe/Paris time-zone" can be stored in a `ZonedDateTime`.
 *
 * This class handles conversion from the local time-line of `LocalDateTime` to the instant
 * time-line of `Instant`. The difference between the two time-lines is the offset from
 * UTC/Greenwich, represented by a `ZoneOffset`.
 *
 * Converting between the two time-lines involves calculating the offset using the rules accessed
 * from the `ZoneId`. Obtaining the offset for an instant is simple, as there is exactly one valid
 * offset for each instant. By contrast, obtaining the offset for a local date-time is not
 * straightforward. There are three cases:
 * - Normal, with one valid offset. For the vast majority of the year, the normal case applies,
 * where there is a single valid offset for the local date-time.
 * - Gap, with zero valid offsets. This is when clocks jump forward typically due to the spring
 * daylight savings change from "winter" to "summer". In a gap there are local date-time values
 * with no valid offset.
 * - Overlap, with two valid offsets. This is when clocks are set back typically due to the autumn
 * daylight savings change from "summer" to "winter". In an overlap there are local date-time
 * values with two valid offsets.
 *
 * Any method that converts directly or implicitly from a local date-time to an instant by
 * obtaining the offset has the potential to be complicated.
 *
 * For Gaps, the general strategy is that if the local date-time falls in the middle of a Gap,
 * then the resulting zoned date-time will have a local date-time shifted forwards by the length
 * of the Gap, resulting in a date-time in the later offset, typically "summer" time.
 *
 * For Overlaps, the general strategy is that if the local date-time falls in the middle of an
 * Overlap, then the previous offset will be retained. If there is no previous offset, or the
 * previous offset is invalid, then the earlier offset is used, typically "summer" time. Two
 * additional methods, `withEarlierOffsetAtOverlap()` and `withLaterOffsetAtOverlap()`, help
 * manage the case of an overlap.
 */
export const ZonedDateTime: ZonedDateTimeConstructor

export interface ZonedDateTimeConstructor extends Prototype<ZonedDateTime>, OfEpochSecond<ZonedDateTime> {
    FROM: TemporalQuery<ZonedDateTime>;

    from(temporal: TemporalAccessor): ZonedDateTime;
    now(clockOrZone: Clock | ZoneId): ZonedDateTime;
    of(localDateTime: LocalDateTime, zone: ZoneId): ZonedDateTime;
    of(date: LocalDate, time: LocalTime, zone: ZoneId): ZonedDateTime;
    of(year: number, month: number, dayOfMonth: number, hour: number, minute: number, second: number, nanoOfSecond: number, zone: ZoneId): ZonedDateTime;
    /**
     * Obtains an instance of ZonedDateTime from an Instant.
     *
     * This creates a zoned date-time with the same instant as that specified. Calling
     * `ChronoZonedDateTime.toInstant()` will return an instant equal to the one used here.
     *
     * Converting an instant to a zoned date-time is simple as there is only one valid offset for
     * each instant.
     */
    ofInstant(instant: Instant, zone: ZoneId): ZonedDateTime;
    /**
     * Obtains an instance of `ZonedDateTime` from the instant formed by combining the local
     * date-time and offset.
     *
     * This creates a zoned date-time by combining the `LocalDateTime` and `ZoneOffset`. This
     * combination uniquely specifies an instant without ambiguity.
     *
     * Converting an instant to a zoned date-time is simple as there is only one valid offset for
     * each instant. If the valid offset is different to the offset specified, the the date-time
     * and offset of the zoned date-time will differ from those specified.
     *
     * If the `ZoneId` to be used is a `ZoneOffset`, this method is equivalent to
     * `of(LocalDateTime, ZoneId)`.
     */
    ofInstant(localDateTime: LocalDateTime, offset: ZoneOffset, zone: ZoneId): ZonedDateTime;
    /**
     * Obtains an instance of `ZonedDateTime` from a local date-time using the preferred offset
     * if possible.
     *
     * The local date-time is resolved to a single instant on the time-line. This is achieved by
     * finding a valid offset from UTC/Greenwich for the local date-time as defined by the rules
     * of the zone ID.
     *
     * In most cases, there is only one valid offset for a local date-time. In the case of an
     * overlap, where clocks are set back, there are two valid offsets. If the preferred offset
     * is one of the valid offsets then it is used. Otherwise the earlier valid offset is used,
     * typically corresponding to "summer".
     *
     * In the case of a gap, where clocks jump forward, there is no valid offset. Instead, the
     * local date-time is adjusted to be later by the length of the gap. For a typical one hour
     * daylight savings change, the local date-time will be moved one hour later into the offset
     * typically corresponding to "summer".
     */
    ofLocal(localDateTime: LocalDateTime, zone: ZoneId, preferredOffset?: ZoneOffset | null): ZonedDateTime;
    /**
     * Obtains an instance of `ZonedDateTime` strictly validating the combination of local
     * date-time, offset and zone ID.
     *
     * This creates a zoned date-time ensuring that the offset is valid for the local date-time
     * according to the rules of the specified zone. If the offset is invalid, an exception is
     * thrown.
     */
    ofStrict(localDateTime: LocalDateTime, offset: ZoneOffset, zone: ZoneId): ZonedDateTime;
    parse(text: string, formatter?: DateTimeFormatter): ZonedDateTime;
}

export interface ZonedDateTime extends ChronoZonedDateTime {
    dayOfMonth(): number;
    dayOfWeek(): DayOfWeek;
    dayOfYear(): number;
    equals(other: any): boolean;
    getLong(field: TemporalField): number;
    hashCode(): number;
    hour(): number;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
    minus(amountToSubtract: number, unit: TemporalUnit): ZonedDateTime;
    minus(amount: TemporalAmount): ZonedDateTime;
    minusDays(days: number): ZonedDateTime;
    minusHours(hours: number): ZonedDateTime;
    minusMinutes(minutes: number): ZonedDateTime;
    minusMonths(months: number): ZonedDateTime;
    minusNanos(nanos: number): ZonedDateTime;
    minusSeconds(seconds: number): ZonedDateTime;
    minusWeeks(weeks: number): ZonedDateTime;
    minusYears(years: number): ZonedDateTime;
    minute(): number;
    month(): Month;
    monthValue(): number;
    nano(): number;
    offset(): ZoneOffset;
    plus(amountToAdd: number, unit: TemporalUnit): ZonedDateTime;
    plus(amount: TemporalAmount): ZonedDateTime;
    plusDays(days: number): ZonedDateTime;
    plusHours(hours: number): ZonedDateTime;
    plusMinutes(minutes: number): ZonedDateTime;
    plusMonths(months: number): ZonedDateTime;
    plusNanos(nanos: number): ZonedDateTime;
    plusSeconds(seconds: number): ZonedDateTime;
    plusWeeks(weeks: number): ZonedDateTime;
    plusYears(years: number): ZonedDateTime;
    range(field: TemporalField): ValueRange;
    second(): number;
    toJSON(): string;
    toLocalDate(): LocalDate;
    toLocalDateTime(): LocalDateTime;
    toLocalTime(): LocalTime;
    toOffsetDateTime(): OffsetDateTime;
    toString(): string;
    truncatedTo(unit: TemporalUnit): ZonedDateTime;
    until(endExclusive: Temporal, unit: TemporalUnit): number;
    with(adjuster: TemporalAdjuster): ZonedDateTime;
    with(field: TemporalField, newValue: number): ZonedDateTime;
    withDayOfMonth(dayOfMonth: number): ZonedDateTime;
    withDayOfYear(dayOfYear: number): ZonedDateTime;
    /**
     * Returns a copy of this date-time changing the zone offset to the earlier of the two valid
     * offsets at a local time-line overlap.
     *
     * This method only has any effect when the local time-line overlaps, such as at an autumn
     * daylight savings cutover. In this scenario, there are two valid offsets for the local
     * date-time. Calling this method will return a zoned date-time with the earlier of the two
     * selected.
     *
     * If this method is called when it is not an overlap, `this` is returned.
     */
    withEarlierOffsetAtOverlap(): ZonedDateTime;
    /**
     * Returns a copy of this date-time with the zone ID set to the offset.
     *
     * This returns a zoned date-time where the zone ID is the same as `offset()`. The local
     * date-time, offset and instant of the result will be the same as in this date-time.
     *
     * Setting the date-time to a fixed single offset means that any future calculations, such as
     * addition or subtraction, have no complex edge cases due to time-zone rules. This might also
     * be useful when sending a zoned date-time across a network, as most protocols, such as
     * ISO-8601, only handle offsets, and not region-based zone IDs.
     */
    withFixedOffsetZone(): ZonedDateTime;
    withHour(hour: number): ZonedDateTime;
    /**
     * Returns a copy of this date-time changing the zone offset to the later of the two valid
     * offsets at a local time-line overlap.
     *
     * This method only has any effect when the local time-line overlaps, such as at an autumn
     * daylight savings cutover. In this scenario, there are two valid offsets for the local
     * date-time. Calling this method will return a zoned date-time with the later of the two
     * selected.
     *
     * If this method is called when it is not an overlap, `this` is returned.
     */
    withLaterOffsetAtOverlap(): ZonedDateTime;
    withMinute(minute: number): ZonedDateTime;
    withMonth(month: number): ZonedDateTime;
    withNano(nanoOfSecond: number): ZonedDateTime;
    withSecond(second: number): ZonedDateTime;
    withYear(year: number): ZonedDateTime;
    /**
     * Returns a copy of this date-time with a different time-zone, retaining the instant.
     *
     * This method changes the time-zone and retains the instant. This normally results in a
     * change to the local date-time.
     *
     * This method is based on retaining the same instant, thus gaps and overlaps in the local
     * time-line have no effect on the result.
     *
     * To change the offset while keeping the local time, use `withZoneSameLocal(ZoneId)`.
     */
    withZoneSameInstant(zone: ZoneId): ZonedDateTime;
    /**
     * Returns a copy of this date-time with a different time-zone, retaining the local date-time
     * if possible.
     *
     * This method changes the time-zone and retains the local date-time. The local date-time is
     * only changed if it is invalid for the new zone, determined using the same approach as
     * `ofLocal(LocalDateTime, ZoneId, ZoneOffset)`.
     *
     * To change the zone and adjust the local date-time, use `withZoneSameInstant(ZoneId)`.
     */
    withZoneSameLocal(zone: ZoneId): ZonedDateTime;
    year(): number;
    zone(): ZoneId;
}

export const ZoneId: ZoneIdConstructor

export interface ZoneIdConstructor extends Prototype<ZoneId> {
    SYSTEM: ZoneId;
    UTC: ZoneId;

    systemDefault(): ZoneId;
    of(zoneId: string): ZoneId;
    ofOffset(prefix: string, offset: ZoneOffset): ZoneId;
    from(temporal: TemporalAccessor): ZoneId;

    getAvailableZoneIds(): string[];
}

export interface ZoneId {
    equals(other: any): boolean;
    hashCode(): number;
    id(): string;
    normalized(): ZoneId;
    rules(): ZoneRules;
    toJSON(): string;
    toString(): string;
}

export const ZoneOffset: ZoneOffsetConstructor

export interface ZoneOffsetConstructor extends Prototype<ZoneOffset> {
    MAX_SECONDS: ZoneOffset;
    UTC: ZoneOffset;
    MIN: ZoneOffset;
    MAX: ZoneOffset;

    of(offsetId: string): ZoneOffset;
    ofHours(hours: number): ZoneOffset;
    ofHoursMinutes(hours: number, minutes: number): ZoneOffset;
    ofHoursMinutesSeconds(hours: number, minutes: number, seconds: number): ZoneOffset;
    ofTotalMinutes(totalMinutes: number): ZoneOffset;
    ofTotalSeconds(totalSeconds: number): ZoneOffset;
}

export interface ZoneOffset extends ZoneId, TemporalAdjuster, Comparable<ZoneOffset> {
    adjustInto(temporal: Temporal): Temporal;
    get(field: TemporalField): number;
    getLong(field: TemporalField): number;
    hashCode(): number;
    id(): string;
    rules(): ZoneRules;
    toString(): string;
    totalSeconds(): number;
}

export const ZoneRegion: ZoneRegionConstructor

export interface ZoneRegionConstructor extends Prototype<ZoneRegion> {
    ofId(zoneId: string): ZoneId;
}

export interface ZoneRegion extends ZoneId {
    id(): string;
    rules(): ZoneRules;
}

export const DayOfWeek: DayOfWeekConstructor

export interface DayOfWeekConstructor extends Prototype<DayOfWeek> {
    MONDAY: DayOfWeek;
    TUESDAY: DayOfWeek;
    WEDNESDAY: DayOfWeek;
    THURSDAY: DayOfWeek;
    FRIDAY: DayOfWeek;
    SATURDAY: DayOfWeek;
    SUNDAY: DayOfWeek;

    FROM: TemporalQuery<DayOfWeek>;

    from(temporal: TemporalAccessor): DayOfWeek;
    of(dayOfWeek: number): DayOfWeek;
    valueOf(name: string): DayOfWeek;
    values(): DayOfWeek[];
}

export interface DayOfWeek extends TemporalAccessor, TemporalAdjuster, Comparable<DayOfWeek> {
    adjustInto(temporal: Temporal): Temporal;
    getLong(field: TemporalField): number;
    isSupported(field: TemporalField): boolean;
    minus(days: number): DayOfWeek;
    name(): string;
    ordinal(): number;
    plus(days: number): DayOfWeek;
    toJSON(): string;
    toString(): string;
    value(): number;
}

export const Month: MonthConstructor

export interface MonthConstructor extends Prototype<Month> {
    JANUARY: Month;
    FEBRUARY: Month;
    MARCH: Month;
    APRIL: Month;
    MAY: Month;
    JUNE: Month;
    JULY: Month;
    AUGUST: Month;
    SEPTEMBER: Month;
    OCTOBER: Month;
    NOVEMBER: Month;
    DECEMBER: Month;

    from(temporal: TemporalAccessor): Month;
    of(month: number): Month;
    valueOf(name: string): Month;
    values(): Month[];
}

export interface Month extends TemporalAccessor, TemporalAdjuster, Comparable<Month> {
    adjustInto(temporal: Temporal): Temporal;
    firstDayOfYear(leapYear: boolean): number;
    firstMonthOfQuarter(): Month;
    getLong(field: TemporalField): number;
    isSupported(field: TemporalField): boolean;
    length(leapYear: boolean): number;
    maxLength(): number;
    minLength(): number;
    minus(months: number): Month;
    name(): string;
    ordinal(): number;
    plus(months: number): Month;
    toJSON(): string;
    toString(): string;
    value(): number;
}

// ----------------------------------------------------------------------------
//   FORMAT
// ----------------------------------------------------------------------------

export const DateTimeFormatter: DateTimeFormatterConstructor

export interface DateTimeFormatterConstructor extends Prototype<DateTimeFormatter> {
    ISO_LOCAL_DATE: DateTimeFormatter;
    ISO_LOCAL_TIME: DateTimeFormatter;
    ISO_LOCAL_DATE_TIME: DateTimeFormatter;
    ISO_INSTANT: DateTimeFormatter;
    ISO_OFFSET_DATE_TIME: DateTimeFormatter;
    ISO_OFFSET_TIME: DateTimeFormatter;
    ISO_ZONED_DATE_TIME: DateTimeFormatter;

    ofPattern(pattern: string): DateTimeFormatter;
    parsedExcessDays(): TemporalQuery<Period>;
    parsedLeapSecond(): TemporalQuery<boolean>;
}

export interface DateTimeFormatter {
    chronology(): Chronology | null;
    decimalStyle(): DecimalStyle;
    format(temporal: TemporalAccessor): string;
    parse(text: string): TemporalAccessor;
    parse<T>(text: string, query: TemporalQuery<T>): T;
    parseUnresolved(text: string, position: ParsePosition): TemporalAccessor;
    toString(): string;
    withChronology(chrono: Chronology): DateTimeFormatter;
    withResolverStyle(resolverStyle: ResolverStyle): DateTimeFormatter;
}

export const DateTimeFormatterBuilder: DateTimeFormatterBuilderConstructor

export interface DateTimeFormatterBuilderConstructor extends Prototype<DateTimeFormatterBuilder> {
}

export interface DateTimeFormatterBuilder {
    append(formatter: DateTimeFormatter): DateTimeFormatterBuilder;
    appendFraction(field: TemporalField, minWidth: number, maxWidth: number, decimalPoint: boolean): DateTimeFormatterBuilder;
    appendInstant(fractionalDigits: number): DateTimeFormatterBuilder;
    appendLiteral(literal: any): DateTimeFormatterBuilder;
    appendOffset(pattern: string, noOffsetText: string): DateTimeFormatterBuilder;
    appendOffsetId(): DateTimeFormatterBuilder;
    appendPattern(pattern: string): DateTimeFormatterBuilder;
    appendValue(field: TemporalField, width?: number, maxWidth?: number, signStyle?: SignStyle): DateTimeFormatterBuilder;
    appendValueReduced(field: TemporalField, width: number, maxWidth: number, base: ChronoLocalDate | number): DateTimeFormatterBuilder;
    appendZoneId(): DateTimeFormatterBuilder;
    optionalEnd(): DateTimeFormatterBuilder;
    optionalStart(): DateTimeFormatterBuilder;
    padNext(): DateTimeFormatterBuilder;
    parseCaseInsensitive(): DateTimeFormatterBuilder;
    parseCaseSensitive(): DateTimeFormatterBuilder;
    parseLenient(): DateTimeFormatterBuilder;
    parseStrict(): DateTimeFormatterBuilder;
    toFormatter(resolverStyle?: ResolverStyle): DateTimeFormatter;
}

export interface DecimalStyle {
    decimalSeparator(): string;
    equals(other: any): boolean;
    hashCode(): any;
    negativeSign(): string;
    positiveSign(): string;
    toString(): string;
    zeroDigit(): string;
}

export const ResolverStyle: ResolverStyleConstructor

export interface ResolverStyleConstructor extends Prototype<ResolverStyle> {
    STRICT: ResolverStyle;
    SMART: ResolverStyle;
    LENIENT: ResolverStyle;
}

export interface ResolverStyle {
    equals(other: any): boolean;
    toJSON(): string;
    toString(): string;
}

export const SignStyle: SignStyleConstructor

export interface SignStyleConstructor extends Prototype<SignStyle> {
    NORMAL: SignStyle;
    NEVER: SignStyle;
    ALWAYS: SignStyle;
    EXCEEDS_PAD: SignStyle;
    NOT_NEGATIVE: SignStyle;
}

export interface SignStyle {
    equals(other: any): boolean;
    toJSON(): string;
    toString(): string;
}

export const TextStyle: TextStyleConstructor

export interface TextStyleConstructor extends Prototype<TextStyle> {
    FULL: TextStyle;
    FULL_STANDALONE: TextStyle;
    SHORT: TextStyle;
    SHORT_STANDALONE: TextStyle;
    NARROW: TextStyle;
    NARROW_STANDALONE: TextStyle;
}

export interface TextStyle {
    asNormal(): TextStyle;
    asStandalone(): TextStyle;
    isStandalone(): boolean;

    equals(other: any): boolean;
    toJSON(): string;
    toString(): string;
}

export interface ParsePosition {
    getIndex(): number;
    setIndex(index: number): void;
    getErrorIndex(): number;
    setErrorIndex(errorIndex: number): void;
}

// ----------------------------------------------------------------------------
//   ZONE
// ----------------------------------------------------------------------------

export const ZoneOffsetTransition: ZoneOffsetTransitionConstructor

export interface ZoneOffsetTransitionConstructor extends Prototype<ZoneOffsetTransition> {
    of(transition: LocalDateTime, offsetBefore: ZoneOffset, offsetAfter: ZoneOffset): ZoneOffsetTransition;
}

export interface ZoneOffsetTransition extends Comparable<ZoneOffsetTransition> {
    dateTimeAfter(): LocalDateTime;
    dateTimeBefore(): LocalDateTime;
    duration(): Duration;
    durationSeconds(): number;
    hashCode(): number;
    instant(): Instant;
    isGap(): boolean;
    isOverlap(): boolean;
    isValidOffset(offset: ZoneOffset): boolean;
    offsetAfter(): ZoneOffset;
    offsetBefore(): ZoneOffset;
    toEpochSecond(): number;
    toString(): string;
    validOffsets(): ZoneOffset[];
}

export interface ZoneOffsetTransitionRule {
    // TODO: Not implemented yet
}

export const ZoneRules: ZoneRulesConstructor

export interface ZoneRulesConstructor extends Prototype<ZoneRules> {
    of(offest: ZoneOffset): ZoneRules;
}

export interface ZoneRules {
    /**
     * Gets the offset applicable at the specified instant in these rules.
     *
     * The mapping from an instant to an offset is simple, there is only one valid offset
     * for each instant. This method returns that offset.
     */
    offset(instant: Instant): ZoneOffset;
    /**
     * Gets a suitable offset for the specified local date-time in these rules.
     *
     * The mapping from a local date-time to an offset is not straightforward. There are
     * three cases:
     * - Normal, with one valid offset. For the vast majority of the year, the normal case
     * applies, where there is a single valid offset for the local date-time.
     * - Gap, with zero valid offsets. This is when clocks jump forward typically due to the
     * spring daylight savings change from "winter" to "summer". In a gap there are local
     * date-time values with no valid offset.
     * - Overlap, with two valid offsets. This is when clocks are set back typically due to
     * the autumn daylight savings change from "summer" to "winter". In an overlap there are
     * local date-time values with two valid offsets.
     *
     * Thus, for any given local date-time there can be zero, one or two valid offsets. This
     * method returns the single offset in the Normal case, and in the Gap or Overlap case it
     * returns the offset before the transition.
     *
     * Since, in the case of Gap and Overlap, the offset returned is a "best" value, rather
     * than the "correct" value, it should be treated with care. Applications that care about
     * the correct offset should use a combination of this method, `getValidOffsets` and
     * `getTransition`.
     */
    offset(localDateTime: LocalDateTime): ZoneOffset;
    toJSON(): string;
    daylightSavings(instant: Instant): Duration;
    isDaylightSavings(instant: Instant): boolean;
    isFixedOffset(): boolean;
    /**
     * Checks if the offset date-time is valid for these rules.
     *
     * To be valid, the local date-time must not be in a gap and the offset must match the
     * valid offsets.
     */
    isValidOffset(localDateTime: LocalDateTime, offset: ZoneOffset): boolean;
    nextTransition(instant: Instant): ZoneOffsetTransition;
    offsetOfEpochMilli(epochMilli: number): ZoneOffset;
    offsetOfInstant(instant: Instant): ZoneOffset;
    offsetOfLocalDateTime(localDateTime: LocalDateTime): ZoneOffset;
    previousTransition(instant: Instant): ZoneOffsetTransition;
    standardOffset(instant: Instant): ZoneOffset;
    toString(): string;
    /**
     * Gets the offset transition applicable at the specified local date-time in these rules.
     *
     * The mapping from a local date-time to an offset is not straightforward. There are
     * three cases:
     * - Normal, with one valid offset. For the vast majority of the year, the normal case
     * applies, where there is a single valid offset for the local date-time.
     * - Gap, with zero valid offsets. This is when clocks jump forward typically due to the
     * spring daylight savings change from "winter" to "summer". In a gap there are local
     * date-time values with no valid offset.
     * - Overlap, with two valid offsets. This is when clocks are set back typically due to
     * the autumn daylight savings change from "summer" to "winter". In an overlap there are
     * local date-time values with two valid offsets.
     *
     * A transition is used to model the cases of a Gap or Overlap. The Normal case will return
     * `null`.
     *
     * There are various ways to handle the conversion from a `LocalDateTime`. One technique,
     * using this method, would be:
     * ```
     * const trans = rules.transition(localDT);
     * if (trans === null) {
     *     // Gap or Overlap: determine what to do from transition
     * } else {
     *     // Normal case: only one valid offset
     *     zoneOffset = rules.offset(localDT);
     * }
     * ```
     *
     * @returns the offset transition, `null` if the local date-time is not in transition.
     */
    transition(localDateTime: LocalDateTime): ZoneOffsetTransition;
    transitionRules(): ZoneOffsetTransitionRule[];
    transitions(): ZoneOffsetTransition[];
    /**
     * Gets the offset applicable at the specified local date-time in these rules.
     *
     * The mapping from a local date-time to an offset is not straightforward. There are
     * three cases:
     * - Normal, with one valid offset. For the vast majority of the year, the normal case
     * applies, where there is a single valid offset for the local date-time.
     * - Gap, with zero valid offsets. This is when clocks jump forward typically due to the
     * spring daylight savings change from "winter" to "summer". In a gap there are local
     * date-time values with no valid offset.
     * - Overlap, with two valid offsets. This is when clocks are set back typically due to
     * the autumn daylight savings change from "summer" to "winter". In an overlap there are
     * local date-time values with two valid offsets.
     *
     * Thus, for any given local date-time there can be zero, one or two valid offsets. This
     * method returns that list of valid offsets, which is a list of size 0, 1 or 2. In the
     * case where there are two offsets, the earlier offset is returned at index 0 and the
     * later offset at index 1.
     *
     * There are various ways to handle the conversion from a `LocalDateTime`. One technique,
     * using this method, would be:
     * ```
     * const validOffsets = rules.getOffset(localDT);
     * if (validOffsets.length === 1) {
     *     // Normal case: only one valid offset
     *     zoneOffset = validOffsets[0];
     * } else {
     *     // Gap or Overlap: determine what to do from transition
     *     const trans = rules.transition(localDT);
     * }
     * ```
     *
     * In theory, it is possible for there to be more than two valid offsets. This would happen
     * if clocks to be put back more than once in quick succession. This has never happened in
     * the history of time-zones and thus has no special handling. However, if it were to
     * happen, then the list would return more than 2 entries.
     */
    validOffsets(localDateTime: LocalDateTime): ZoneOffset[];
}

export const ZoneRulesProvider: ZoneRulesProviderConstructor

export interface ZoneRulesProviderConstructor extends Prototype<ZoneRulesProvider> {
    getRules(zoneId: string): ZoneRules;
    getAvailableZoneIds(): string[];
}

export interface ZoneRulesProvider {
}

// ----------------------------------------------------------------------------
//   CHRONO
// ----------------------------------------------------------------------------

// TODO: js-joda doesn't have Chronology yet. Methods like `LocalDate.chronology()`
// actually return an `IsoChronology` so Chronology is an alias type of that class
// for now. Change this if Chronology is added.
export type Chronology = IsoChronology;

export const IsoChronology: IsoChronologyConstructor

export interface IsoChronologyConstructor extends Prototype<IsoChronology> {
    isLeapYear(prolepticYear: number): boolean;
}

export interface IsoChronology {
    equals(other: any): boolean;
    resolveDate(fieldValues: any, resolverStyle: any): any;
    toString(): string;
}

export interface ChronoLocalDate extends Temporal, TemporalAdjuster {
    adjustInto(temporal: Temporal): Temporal;
    format(formatter: DateTimeFormatter): string;
    isSupported(fieldOrUnit: TemporalField | TemporalUnit): boolean;
}

export interface ChronoLocalDateTime extends Temporal, TemporalAdjuster {
    adjustInto(temporal: Temporal): Temporal;
    chronology(): Chronology;
    toEpochSecond(offset: ZoneOffset): number;
    toInstant(offset: ZoneOffset): Instant;
}

export interface ChronoZonedDateTime extends Temporal, ComparableEx<ChronoZonedDateTime> {
    format(formatter: DateTimeFormatter): string;
    toEpochSecond(): number;
    toInstant(): Instant;
}

// ----------------------------------------------------------------------------
//   SUPPORT
// ----------------------------------------------------------------------------

export function use(plugin: Function): any;

// ----------------------------------------------------------------------------
//   EXCEPTIONS
// ----------------------------------------------------------------------------

export class DateTimeException extends Error {
    constructor(message?: string, cause?: Error);
}

export class UnsupportedTemporalTypeException extends DateTimeException { }

export class DateTimeParseException extends Error {
    constructor(message?: string, text?: string, index?: number, cause?: Error);

    parsedString(): string;
    errorIndex(): number;
}

export class ArithmeticException extends Error { }
export class IllegalArgumentException extends Error { }
export class IllegalStateException extends Error { }
export class NullPointerException extends Error { }

export const __esModule: true;
export as namespace JSJoda;

// HELPERS

// https://stackoverflow.com/questions/54520676/in-typescript-how-to-get-the-keys-of-an-object-type-whose-values-are-of-a-given
type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]

export type DayOfWeekConsts = Exclude<KeysMatching<DayOfWeekConstructor, DayOfWeek>, 'prototype'>
export type ChronoUnitConsts = Exclude<KeysMatching<ChronoUnitConstructor, ChronoUnit>, 'prototype'>
