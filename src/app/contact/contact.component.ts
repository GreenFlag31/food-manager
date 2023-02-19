import { Component, OnInit } from '@angular/core';
import { fadeInOut, iconsCode, selfPic, title } from '../animations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [iconsCode, selfPic, title],
})
export class ContactComponent implements OnInit {
  show = true;
  imgList = [
    '../../assets/contact-page/Angular.png',
    '../../assets/contact-page/JS.png',
    '../../assets/contact-page/HTML.png',
    '../../assets/contact-page/CSS.png',
    '../../assets/contact-page/NodeJS.png',
  ];
  constructor() {}

  ngOnInit(): void {}
}
