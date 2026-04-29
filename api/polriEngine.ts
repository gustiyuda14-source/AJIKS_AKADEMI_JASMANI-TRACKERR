interface ScoreTable {
  nilai: number;
  target: number;
}

class PolriEngine {
  private static readonly tables: {
    pria: Record<string, ScoreTable[]>;
    wanita: Record<string, ScoreTable[]>;
  } = {
    pria: {
      run12: [],
      pullup: [],
      situp: [],
      pushup: [],
      fig8: [],
    },
    wanita: {
      run12: [],
      pullup: [],
      situp: [],
      pushup: [],
      fig8: [],
    },
  };

  static {
    // Initialize tables on class load
    this.tables.pria.run12 = this.generateTable(3444, 1349, false);
    this.tables.pria.pullup = this.generateTable(17, 1, false);
    this.tables.pria.situp = this.generateTable(40, 1, false);
    this.tables.pria.pushup = this.generateTable(42, 1, false);
    this.tables.pria.fig8 = this.generateTable(16.2, 26.1, true);

    this.tables.wanita.run12 = this.generateTable(3095, 1013, false);
    this.tables.wanita.pullup = this.generateTable(72, 1, false);
    this.tables.wanita.situp = this.generateTable(50, 1, false);
    this.tables.wanita.pushup = this.generateTable(37, 1, false);
    this.tables.wanita.fig8 = this.generateTable(17.6, 27.5, true);
  }

  private static generateTable(
    target100: number,
    target1: number,
    isTimeBased: boolean
  ): ScoreTable[] {
    const table: ScoreTable[] = [];
    const increment = (target100 - target1) / 99;

    for (let nilai = 100; nilai >= 1; nilai--) {
      let limit = target1 + (nilai - 1) * increment;

      if (isTimeBased) {
        limit = Math.round(limit * 10) / 10;
      } else {
        limit = Math.round(limit);
      }

      if (nilai === 100) limit = target100;
      if (nilai === 1) limit = target1;

      table.push({ nilai, target: limit });
    }

    table.push({ nilai: 0, target: isTimeBased ? 999 : 0 });
    return table;
  }

  static getScore(
    gender: 'L' | 'P',
    testKey: string,
    rawValue: number
  ): number {
    const genderKey = gender === 'L' ? 'pria' : 'wanita';
    const table = (this.tables as any)[genderKey][testKey];

    if (!table) return 0;

    const isInverted = testKey === 'fig8';

    for (const { nilai, target } of table) {
      if (isInverted ? rawValue <= target : rawValue >= target) {
        return nilai;
      }
    }

    return 0;
  }

  static calculateFinalScore(
    gender: 'L' | 'P',
    run12: number,
    fig8: number,
    pushup: number,
    situp: number,
    pullup: number
  ) {
    const scoreA = this.getScore(gender, 'run12', run12);
    const scoreB = [
      this.getScore(gender, 'pullup', pullup),
      this.getScore(gender, 'situp', situp),
      this.getScore(gender, 'pushup', pushup),
      this.getScore(gender, 'fig8', fig8),
    ].reduce((a, b) => a + b, 0) / 4;

    const finalScore = Math.round((scoreA + scoreB) / 2);
    const isTms = [scoreA, scoreB * 4].some((s) => s < 41);

    let grade: 'A' | 'B' | 'C' | 'D' | 'TMS' = 'D';
    if (isTms) grade = 'TMS';
    else if (finalScore >= 80) grade = 'A';
    else if (finalScore >= 61) grade = 'B';
    else if (finalScore >= 41) grade = 'C';

    return {
      scoreA: Math.round(scoreA),
      scoreB: Math.round(scoreB),
      finalScore,
      isTms,
      grade,
    };
  }
}

export default PolriEngine;
