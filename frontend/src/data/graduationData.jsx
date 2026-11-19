export const GRADUATION_DATA = {
  family: {
    key: "family",
    label: "Gia đình & Người thân",
    badge: "Thiệp mời trân trọng • Gia đình & Người thân",
    defaultName: "Ba Mẹ",
    salutation: (name) => `Kính mời ${name} đến dự Lễ Tốt Nghiệp của con`,
    salutationHtml: (name) => (
      <>
        Kính mời <span className="italic text-champagne">{name}</span> <br />
        đến dự Lễ Tốt Nghiệp của con
      </>
    ),
    subtitle: "Cột mốc trưởng thành sau 4 năm đại học sẽ chỉ thật sự trọn vẹn khi có sự hiện diện, ánh mắt tự hào và những lời chúc phúc của gia đình trong ngày trọng đại này.",
    messageHeading: "Bốn năm đèn sách và điểm tựa mang tên Gia Đình",
    messageParagraphs: (name, gradName) => [
      `Kính thưa ${name},`,
      `Suốt 4 năm giảng đường với biết bao nỗ lực, mỗi bước đi của ${gradName} đều được nâng đỡ bởi tình yêu thương, sự hy sinh thầm lặng và niềm tin vững chắc từ ${name} cùng gia đình.`,
      `Tấm bằng cử nhân sắp đón nhận không chỉ là thành quả học tập, mà là món quà tri ân chân thành nhất gửi tới ${name}. Con/cháu kính mong ${name} sắp xếp thời gian đến chung vui, chứng kiến khoảnh khắc nhận bằng và lưu giữ những bức ảnh gia đình thật ấm áp!`
    ],
    schedule: [
      {
        time: "9:00 – 13:30",
        desc: "Đón tiếp bạn bè tại Thư viện & Chụp ảnh kỷ niệm trước lễ",
        highlight: false,
      },
      {
        time: "14:00 – 17:30",
        desc: "Nghi thức Lễ Tốt Nghiệp & Trao bằng chính thức trong Hội trường A5",
        highlight: true,
      },
      {
        time: "17:30 – 18:30",
        desc: "Chụp ảnh đại gia đình cùng lễ phục cử nhân tại Thư viện",
        highlight: false,
      }
    ],
    venueNote: (_name, gradName) => (
      <>
        <strong>Hỗ trợ đón tiếp:</strong> Khi tới <strong>Trường Đại học Bách Khoa</strong>, sẽ có <strong>2 bãi giữ xe</strong> nằm ở hai cổng Lý Thường Kiệt (Cổng 1) và Cổng Tô Hiến Thành (Cổng 2). Nếu gặp khó khăn trong việc tìm đường, xin vui lòng liên hệ <strong>Tân Cử Nhân {gradName}</strong> qua số điện thoại <strong>0982046478</strong> để được hướng dẫn nhanh chóng.
      </>
    ),
    parkingList: [
      {
        title: "Đi ô tô gia đình:",
        desc: "Vui lòng đi thẳng vào Cổng Chính (Cổng 1 — 268 Lý Thường Kiệt). Bảo vệ trường sẽ hướng dẫn đỗ xe tại bãi ô tô có bóng mát ngay cạnh Hội trường Lớn (đi bộ chưa tới 40m)."
      },
      {
        title: "Đi xe công nghệ / Taxi:",
        desc: "Xe có thể chạy qua cổng để trả khách ngay trước cổng Lý Thường Kiệt."
      },
      {
        title: "Đi xe máy:",
        desc: "Gửi tại Nhà xe tại hai cổng Lý Thường Kiệt (Cổng 1) và Tô Hiến Thành (Cổng 2). Bãi xe rộng rãi, quẹt thẻ nhanh và đi bộ chưa tới 1 phút là tới khu vực chụp ảnh."
      }
    ],
    arrivalNotes: [
      {
        title: "Lưu ý:",
        desc: "Trang phục lịch sự, thoải mái; có thể chọn tông trắng, kem, be hoặc xanh navy để ảnh gia đình hài hòa. Thời tiết có thể nắng, gia đình nên chuẩn bị ô và nước uống."
      }
    ],
    closingHeading: "Con/cháu xin chân thành cảm ơn!",
    closingBody: (name) => `Sự hiện diện của ${name} là niềm hạnh phúc và niềm tự hào lớn nhất trong ngày tốt nghiệp. Kính chúc ${name} luôn dồi dào sức khỏe và bình an!`
  },

  friends: {
    key: "friends",
    label: "Bạn bè & Đồng môn",
    badge: "Thiệp mời thân thiết • Bạn bè & Đồng môn",
    defaultName: "Hội Bạn Thân",
    salutation: (name) => `Ê ${name} ơi, lên đồ đi dự Lễ Tốt Nghiệp của mình nhé!`,
    salutationHtml: (name) => (
      <>
        Ê <span className="italic text-champagne">{name}</span> ơi, <br />
        lên đồ đi dự Lễ Tốt Nghiệp của mình nhé!
      </>
    ),
    subtitle: "Sau bao mùa chạy deadline sấp mặt, làm đồ án xuyên đêm và những cữ cà phê cứu rỗi thanh xuân, cuối cùng ngày khoác áo cử nhân cũng tới rồi!",
    messageHeading: "Thanh xuân đại học chắc chắn không thể thiếu mặt bạn",
    messageParagraphs: (name, gradName) => [
      `Gửi ${name},`,
      `Bốn năm đại học trôi qua nhanh như một cái chớp mắt, và điều rực rỡ nhất của quãng thời gian này chính là được đồng hành, chia sẻ từng chiếc deadline và những trận cười sảng khoái cùng ${name}.`,
      `Ngày 28/11 này, ${gradName} chính thức "tốt nghiệp" khỏi kiếp sinh viên. Nhớ tranh thủ ghé trường chụp với mình một bộ ảnh kỷ yếu thật cháy để lưu giữ thanh xuân nhé!`
    ],
    schedule: [
      {
        time: "9:00 – 13:30",
        desc: "Hội ngộ tại khu vực Trường Đại học Bách Khoa • Check-in trước giờ lễ",
        highlight: false,
      },
      {
        time: "14:00 – 17:30",
        desc: "Nghi thức Lễ Tốt Nghiệp & Trao bằng chính thức tại Hội trường A5",
        highlight: true,
      },
      {
        time: "17:30 – 18:30",
        desc: "Chụp ảnh tung mũ cử nhân cùng hội bạn tại khu vực thư viện và sân trường",
        highlight: false,
      }
    ],
    venueNote: (_name, gradName) => (
      <>
        <strong>Mẹo hẹn gặp nhanh:</strong> Buổi lễ được tổ chức tại <strong>Hội trường A5, Trường Đại học Bách Khoa</strong>. Bạn có thể ghé Cổng Lý Thường Kiệt hoặc Cổng Tô Hiến Thành, sau đó liên hệ <strong>{gradName}</strong> qua số <strong>0982046478</strong> để được hỗ trợ tìm điểm đón.
      </>
    ),
    parkingList: [
      {
        title: "Đi xe máy:",
        desc: "Gửi xe tại Nhà xe ở Cổng Lý Thường Kiệt (Cổng 1) hoặc Cổng Tô Hiến Thành (Cổng 2). Bãi xe rộng rãi và đi bộ chưa tới vài phút là tới khu vực check-in."
      },
      {
        title: "Đi xe công nghệ / Taxi:",
        desc: "Điểm trả khách thuận tiện nhất là Cổng Lý Thường Kiệt. Sau khi xuống xe, bạn có thể đi vào khu vực hội trường A5 theo hướng dẫn trên bản đồ."
      },
      {
        title: "Đi ô tô:",
        desc: "Có thể vào Cổng Lý Thường Kiệt và dùng bãi gửi xe gia đình trong khuôn viên. Vui lòng báo bảo vệ là khách dự Lễ Tốt Nghiệp để được hướng dẫn."
      }
    ],
    arrivalNotes: [
      {
        title: "Dress Code gợi ý:",
        desc: "Lên đồ thật xinh/bảnh với tông Trắng, Kem, Đen hoặc Xanh Navy để đứng cạnh lễ phục tốt nghiệp lên hình chuẩn tạp chí!"
      },
      {
        title: "Thời tiết & Ánh sáng:",
        desc: "Khung 11:00 nắng đẹp nhưng hơi gắt, mang theo quạt mini cầm tay và son/phấn dặm lại là bao tươi luôn."
      },
      {
        title: "Quà cáp:",
        desc: "Có mặt chụp hình cùng nhau là món quà xịn nhất rồi, không cần hoa hoét cầu kỳ đâu nha!"
      }
    ],
    closingHeading: "Hẹn gặp bạn tại sân trường nhé!",
    closingBody: (name) => `Cảm ơn ${name} vì đã là một phần thanh xuân tuyệt vời của mình. Tới nơi nhớ nháy máy để tụi mình làm ngay một album kỷ niệm thật chất nhé!`
  },

  mentors: {
    key: "mentors",
    label: "Thầy Cô & Hướng dẫn",
    badge: "Thiệp mời kính trọng • Thầy Cô & Người Hướng Dẫn",
    defaultName: "Thầy Minh",
    salutation: (name) => `Trân trọng kính mời ${name} đến chung vui Lễ Tốt Nghiệp`,
    salutationHtml: (name) => (
      <>
        Trân trọng kính mời <span className="italic text-champagne">{name}</span> <br />
        đến chung vui Lễ Tốt Nghiệp
      </>
    ),
    subtitle: "Chặng đường chinh phục tri thức và hoàn thành khóa luận tốt nghiệp của em có dấu ấn sâu sắc từ sự tận tâm dìu dắt và truyền cảm hứng của Thầy/Cô.",
    messageHeading: "Tri ân sự tận tâm dìu dắt trên giảng đường",
    messageParagraphs: (name, gradName) => [
      `Kính gửi ${name},`,
      `Nhìn lại suốt 4 năm học tập và nghiên cứu tại trường, em luôn khắc ghi những bài giảng tâm huyết, những góp ý sắc bén trong quá trình thực hiện đồ án tốt nghiệp cũng như sự động viên quý báu mà ${name} đã dành cho em.`,
      `Nhân dịp Lễ Tốt Nghiệp sắp tới, em ${gradName} xin trân trọng kính mời ${name} dành chút thời gian quý báu đến chung vui và cho em được vinh dự chụp cùng ${name} một bức ảnh kỷ niệm trong ngày hoàn thành khóa học.`
    ],
    schedule: [
      {
        time: "9:00 – 13:30",
        desc: "Đón tiếp Thầy Cô tại khu vực Cổng Lý Thường Kiệt hoặc Hội trường A5",
        highlight: false,
      },
      {
        time: "14:00 – 17:30",
        desc: "Nghi thức Lễ Tốt Nghiệp & Trao bằng Cử nhân tại Hội trường A5",
        highlight: true,
      },
      {
        time: "17:30 – 18:30",
        desc: "Chụp ảnh tri ân cùng Thầy Cô tại khu vực thư viện và sân trường",
        highlight: false,
      }
    ],
    venueNote: (name) => (
      <>
        <strong>Điểm đón tiếp Thầy Cô:</strong> Em xin phép được đón {name} tại <strong>Hội trường A5, Trường Đại học Bách Khoa</strong>. Khi tới <strong>Cổng Lý Thường Kiệt</strong> hoặc <strong>Cổng Tô Hiến Thành</strong>, quý Thầy Cô có thể liên hệ <strong>0982046478</strong> để được đón và hướng dẫn nhanh nhất.
      </>
    ),
    parkingList: [
      {
        title: "Khu vực đỗ xe cho Thầy Cô:",
        desc: "Vui lòng di chuyển qua Cổng Lý Thường Kiệt hoặc Cổng Tô Hiến Thành để gửi xe tại khu vực dành cho khách mời, sau đó đi qua khuôn viên tới Hội trường A5."
      },
      {
        title: "Lối vào thuận tiện:",
        desc: "Cổng Lý Thường Kiệt thuận tiện cho ô tô và xe công nghệ; Cổng Tô Hiến Thành thuận tiện cho xe máy. Bản đồ khuôn viên sẽ làm nổi bật lối phù hợp với từng nhóm khách."
      }
    ],
    arrivalNotes: [
      {
        title: "Liên hệ trực tiếp:",
        desc: "Khi quý Thầy Cô có mặt, vui lòng gọi hoặc nhắn tin số 0982046478 để em ra đón và dẫn tới khu vực lễ tại Hội trường A5."
      },
      {
        title: "Khung giờ linh hoạt:",
        desc: "Em hoàn toàn hiểu lịch giảng dạy và công việc bận rộn của quý Thầy Cô. Dù ghé qua trước hoặc sau nghi thức trao bằng, em đều vô cùng trân quý."
      }
    ],
    closingHeading: "Em xin chân thành cảm ơn và kính chúc sức khỏe!",
    closingBody: (name) => `Một lần nữa, em xin gửi lời tri ân sâu sắc tới ${name}. Kính chúc ${name} luôn dồi dào sức khỏe, hạnh phúc và tiếp tục gặt hái nhiều thành công trên sự nghiệp trồng người!`
  }
};
