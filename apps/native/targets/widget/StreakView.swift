import SwiftUI
import WidgetKit

/// 잠금화면 가로형(.accessoryRectangular) 위젯 본문.
/// 잠금화면은 알파 채널만 사용해 단색으로 렌더하므로 색을 쓰지 않는다.
struct StreakView: View {
  let data: StreakData

  var body: some View {
    HStack(spacing: 8) {
      Image("TolliFace")
        .renderingMode(.template)
        .resizable()
        .scaledToFit()
        .frame(width: 30)

      VStack(alignment: .leading, spacing: 3) {
        HStack(alignment: .firstTextBaseline, spacing: 1) {
          Text("\(data.streak)")
            .font(.system(size: 22, weight: .bold, design: .rounded))
          Text("일")
            .font(.system(size: 12, weight: .medium))
          Text("톨리와 함께")
            .font(.system(size: 11))
            .opacity(0.7)
            .padding(.leading, 3)
        }

        WeekBar(week: data.week, todayIndex: data.todayIndex)
      }

      Spacer(minLength: 0)
    }
    .widgetAccentable()
  }
}

/// 이번 주 월~일 7칸. 완료한 날은 채우고, 아직 오지 않은 날은 더 흐리게 둔다.
private struct WeekBar: View {
  let week: [Bool]
  let todayIndex: Int

  var body: some View {
    HStack(spacing: 3) {
      ForEach(Array(week.enumerated()), id: \.offset) { index, done in
        Capsule()
          .fill(.primary)
          .opacity(opacity(index: index, done: done))
          .frame(height: 5)
      }
    }
  }

  private func opacity(index: Int, done: Bool) -> Double {
    if done { return 1 }
    // 아직 오지 않은 요일은 지나간 빈 요일보다 흐리게 — "놓친 날"과 구분한다.
    return index > todayIndex ? 0.2 : 0.4
  }
}

#if DEBUG
  #Preview(as: .accessoryRectangular) {
    TolliStreakWidget()
  } timeline: {
    StreakEntry(date: .now, data: .mock)
  }
#endif
