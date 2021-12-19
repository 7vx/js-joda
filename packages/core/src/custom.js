import { LocalDate } from './LocalDate'
import { LocalDateTime } from './LocalDateTime'
import { LocalTime } from './LocalTime'
import { ZonedDateTime } from './ZonedDateTime'
import { ChronoUnit } from './temporal/ChronoUnit'
import { Duration } from './Duration'
import { ZoneOffset } from './ZoneOffset'
import { DayOfWeek } from './DayOfWeek'
import { Month } from './Month'
import { ZoneOffsetTransition } from './zone/ZoneOffsetTransition'
import { Instant } from './Instant'
import { MonthDay } from './MonthDay'
import { Year } from './Year'
import { YearMonth } from './YearMonth'
import { OffsetDateTime } from './OffsetDateTime'
import { OffsetTime } from './OffsetTime'
import { ChronoZonedDateTime } from './chrono/ChronoZonedDateTime'

function ofEpochSecond(
	constructor,
	epochSecond,
	zoneId,
) {
	return constructor.ofInstant(Instant.ofEpochSecond(epochSecond), zoneId)
}

function addEpochSecond(constructor) {
	constructor.ofEpochSecond = function (epochSecond, zoneId) {
		return ofEpochSecond(constructor, epochSecond, zoneId)
	}
}

function addComparable(constructor) {
	constructor.prototype.isEqual = function (other) {
		return this.compareTo(other) === 0
	}
}

function addComparableEx(constructor, skip = false) {
	if (!skip) {
		addComparable(constructor)
	}
	constructor.prototype.isEqualOrAfter = function (other) {
		return this.compareTo(other) >= 0
	}
	constructor.prototype.isEqualOrBefore = function (other) {
		return this.compareTo(other) <= 0
	}
}

export function initCustom() {
	// Alternative to ofEpochSecond would be to use a different name e.g. fromEpochSecond
	// Instant.fromEpochSecond = function (epochSeconds) {
	// 	return Instant._create(epochSeconds, 0)
	// }

	addEpochSecond(LocalDate)
	// CAREFUL: LocalDateTime already has ofEpochSecond and we must not replace it because it is used internally. 
	// Instead we patched that method.
	// addEpochSecond(LocalDateTime)
	addEpochSecond(LocalTime)
	addEpochSecond(ZonedDateTime)

	addComparable(ChronoUnit)
	addComparable(Duration)
	addComparable(ZoneOffset)
	addComparable(DayOfWeek)
	addComparable(Month)
	addComparable(ZoneOffsetTransition)

	addComparableEx(Instant)
	addComparableEx(LocalDate)
	addComparableEx(LocalDateTime)
	addComparableEx(LocalTime)
	addComparableEx(MonthDay)
	addComparableEx(Year)
	addComparableEx(YearMonth)
	// CAREFUL: These are special and have different isEqual
	addComparableEx(OffsetDateTime, true)
	addComparableEx(OffsetTime, true)
	addComparableEx(ChronoZonedDateTime, true)
}
