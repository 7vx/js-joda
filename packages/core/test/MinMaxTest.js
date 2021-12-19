import { expect } from 'chai';
import { minOf, maxOf } from '../src/js-joda';
import { LocalDate } from '../src/LocalDate';
import { assertEquals } from './testUtils';
import './_init';

describe('minOf maxOf', () => {
	const arr = [
		LocalDate.parse('2021-10-05'),
		LocalDate.parse('2020-01-10'),
		LocalDate.parse('2020-09-30'),
		LocalDate.parse('2021-03-02'),
		LocalDate.parse('2022-01-01'),
		LocalDate.parse('2017-11-17'),
	]			

    it('maxOf arr works', () => {
        expect(maxOf(...arr)).to.eql(LocalDate.parse('2022-01-01'))
    })

    it('minOf arr works', () => {
        expect(minOf(...arr)).to.eql(LocalDate.parse('2017-11-17'))
    })

    it('maxOf works', () => {
        expect(maxOf(
			LocalDate.parse('2021-10-05'),
			LocalDate.parse('2020-01-10'),
			LocalDate.parse('2020-09-30'),
			LocalDate.parse('2021-03-02'),
			LocalDate.parse('2022-01-01'),
			LocalDate.parse('2017-11-17'),
    	)).to.eql(LocalDate.parse('2022-01-01'))
    })

    it('minOf works', () => {
        expect(minOf(
			LocalDate.parse('2021-10-05'),
			LocalDate.parse('2020-01-10'),
			LocalDate.parse('2020-09-30'),
			LocalDate.parse('2021-03-02'),
			LocalDate.parse('2022-01-01'),
			LocalDate.parse('2017-11-17'),
    	)).to.eql(LocalDate.parse('2017-11-17'))
    })

})