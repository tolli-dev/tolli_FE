import SwiftUI
import WidgetKit

struct StreakEntry: TimelineEntry {
  let date: Date
  let data: StreakData
}

struct StreakProvider: TimelineProvider {
  func placeholder(in context: Context) -> StreakEntry {
    StreakEntry(date: Date(), data: .placeholder)
  }

  func getSnapshot(in context: Context, completion: @escaping (StreakEntry) -> Void) {
    completion(StreakEntry(date: Date(), data: .mock))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<StreakEntry>) -> Void) {
    let entry = StreakEntry(date: Date(), data: .mock)
    // 자정에 요일 표시가 바뀌어야 하므로 다음 자정에 갱신을 예약한다.
    let nextMidnight = Calendar.current.nextDate(
      after: Date(),
      matching: DateComponents(hour: 0, minute: 0),
      matchingPolicy: .nextTime
    ) ?? Date().addingTimeInterval(3600)

    completion(Timeline(entries: [entry], policy: .after(nextMidnight)))
  }
}

struct TolliStreakWidget: Widget {
  private let kind = "TolliStreakWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: StreakProvider()) { entry in
      // containerBackground는 iOS 17+. 16에서는 배경 없이 그대로 그린다.
      if #available(iOS 17.0, *) {
        StreakView(data: entry.data)
          .containerBackground(.clear, for: .widget)
      } else {
        StreakView(data: entry.data)
      }
    }
    .configurationDisplayName("톨리 연속 기록")
    .description("톨리와 함께한 연속 일수와 이번 주 진행을 보여줍니다.")
    .supportedFamilies([.accessoryRectangular])
  }
}

@main
struct TolliWidgetBundle: WidgetBundle {
  var body: some Widget {
    TolliStreakWidget()
  }
}
