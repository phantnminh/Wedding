// Your wedding details. This is the only file you need to edit.
// Change the text between the quotes, and keep the quotes and commas.
// Everything in this file becomes public once the site is published.

window.WEDDING = {
  // shortName appears on the envelope and photos. fullName appears in the invitation.
  // Leave father or mother empty to hide that line.
  groom: {
    shortName: "Nhật Minh",
    fullName: "Phan Trần Nhật Minh",
    role: "Út nam",
    father: "",
    mother: "Trần Thị Thanh",
    address: "220 Nguyễn Thị Định, P. Nam Nha Trang, Khánh Hòa"
  },
  bride: {
    shortName: "Hoài Thương",
    fullName: "Nguyễn Thị Hoài Thương",
    role: "Trưởng nữ",
    father: "Nguyễn Văn Thắng",
    mother: "Phạm Thị Kim Thoa",
    address: "Đường Số 1, Quốc Lộ 27, Thái Sơn, Tân Hội, Lâm Đồng"
  },

  // Wedding day, used for the calendar and countdown.
  // Date format: year-month-day. Time format: hour:minute.
  date: "2026-12-12",
  time: "17:30",

  quoteTitle: "Hai trái tim, một nhịp đập",
  quoteText: "Và từ đây, chúng tôi cùng nhau viết tiếp câu chuyện của mình.",

  // One block for each event. Copy a block to add an event, or delete one.
  // lunarDate, address and mapLink are optional: leave them empty to hide them.
  events: [
    {
      title: "Hôn lễ",
      date: "2026-12-12",
      time: "09:00",
      lunarDate: "04 tháng 11 năm Bính Ngọ",
      venue: "Tư gia",
      address: "",
      mapLink: ""
    },
    {
      title: "Tiệc chung vui",
      date: "2026-12-12",
      time: "17:30",
      lunarDate: "04 tháng 11 năm Bính Ngọ",
      venue: "Khách sạn Angella",
      address: "11 Trần Hưng Đạo, phường Nha Trang, Khánh Hòa",
      mapLink: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch+s%E1%BA%A1n+Angella%2C+11+Tr%E1%BA%A7n+H%C6%B0ng+%C4%90%E1%BA%A1o%2C+Nha+Trang"
    }
  ],

  // The schedule shown over the photo. Copy a line to add a step.
  timeline: [
    { time: "09:00", label: "Hôn lễ tại tư gia" },
    { time: "17:30", label: "Tiệc chung vui tại khách sạn Angella" }
  ],

  thankYou: "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi. Kính mời!",

  // Background music. It starts after the letter opens, and guests can turn it
  // off with the round button. Leave file empty to have no music.
  music: {
    file: "music/vay-cuoi.mp3"
  },

  rsvpBy: "12/12/2026",

  // Paste the whole "SEND THIS TO CLAUDE" line from the Google script here,
  // without the words SEND THIS TO CLAUDE. Until then the form is in test
  // mode and does not save replies.
  rsvpLink: "https://docs.google.com/forms/d/e/1FAIpQLSc1IyiZ-VdSKvT_AIcX5BWrrJKDX_eBVThbHMjrKfNJzvaSYA/viewform?usp=pp_url&entry.341628116=NAME&entry.159835701=Yes,+gladly&entry.2054064020=1&entry.1340065802=MESSAGE",

  // The two gift buttons. Each one opens this person's QR image from the
  // photos folder, and its copy button copies this account number.
  bank: {
    groom: {
      accountNumber: "6010806572",
      qrImage: "photos/bank-qr.jpg"
    },
    bride: {
      accountNumber: "0561000558920",
      qrImage: "photos/bank-qr-bride.jpg"
    }
  }
};
