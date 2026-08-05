import Foundation

/// 위젯이 그리는 값. 지금은 mock이고, 디자인 확정 후 App Group의
/// UserDefaults에서 읽어오도록 `.current` 구현만 교체하면 된다.
struct StreakData {
  /// 연속 학습 일수.
  let streak: Int
  /// 이번 주 월~일 완료 여부. 항상 7개.
  let week: [Bool]

  /// 오늘이 월~일 중 몇 번째인지 (월=0). 아직 오지 않은 요일을 흐리게 그리는 데 쓴다.
  var todayIndex: Int {
    // Calendar의 weekday는 일=1 … 토=7. 월=0 기준으로 바꾼다.
    let weekday = Calendar.current.component(.weekday, from: Date())
    return (weekday + 5) % 7
  }
}

extension StreakData {
  /// 디자인 컨펌용 mock. 23일 연속, 이번 주는 목요일까지 완료.
  static let mock = StreakData(
    streak: 23,
    week: [true, true, true, true, false, false, false]
  )

  /// 위젯 갤러리 미리보기용.
  static let placeholder = StreakData(
    streak: 0,
    week: Array(repeating: false, count: 7)
  )
}
